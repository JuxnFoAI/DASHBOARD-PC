import { beforeEach, describe, expect, it, vi } from "vitest";
import { VaultError } from "@features/vault/VaultError.ts";
import { makeTestTask } from "../makeTestTask.ts";
import type { Task } from "../types/index.ts";

const persistVaultTasks = vi.hoisted(() => vi.fn());
const loadVaultTasks = vi.hoisted(() => vi.fn());

vi.mock("@features/vault/services/index.ts", () => ({
  loadVaultTasks,
  persistVaultTasks,
}));

import { useBoardStore } from "./boardStore.ts";

describe("useBoardStore", () => {
  beforeEach(() => {
    persistVaultTasks.mockReset();
    loadVaultTasks.mockReset();
    useBoardStore.getState().clearForLock();
  });

  it("mantiene el título nuevo cuando el cifrado termina", async () => {
    const task = savedTask();
    persistVaultTasks.mockResolvedValueOnce(undefined);

    useBoardStore.getState().setTaskTitle(task.id, "Borrador");
    await flushMicrotasks();

    expect(useBoardStore.getState().tasks[0]?.title).toBe("Borrador");
  });

  it("restaura el tablero guardado si el cifrado falla", async () => {
    const task = savedTask();
    const saved = useBoardStore.getState().tasks;
    persistVaultTasks.mockRejectedValueOnce(new Error("disk"));

    useBoardStore.getState().setTaskTitle(task.id, "Borrador");
    await flushMicrotasks();

    expect(useBoardStore.getState().tasks).toBe(saved);
  });

  it("publica un aviso de guardado cuando el cifrado falla", async () => {
    const task = savedTask();
    persistVaultTasks.mockRejectedValueOnce(new Error("disk"));

    useBoardStore.getState().setTaskTitle(task.id, "Borrador");
    await flushMicrotasks();

    expect(useBoardStore.getState().saveNotice).toBe(
      "No se pudieron guardar las tareas.",
    );
  });

  it("no sustituye el tablero por el error de lectura", async () => {
    const task = savedTask();
    persistVaultTasks.mockRejectedValueOnce(new Error("disk"));

    useBoardStore.getState().setTaskTitle(task.id, "Borrador");
    await flushMicrotasks();

    expect(useBoardStore.getState().errorMessage).toBeNull();
  });

  it("deja editar después de un guardado fallido", async () => {
    const task = savedTask();
    persistVaultTasks.mockRejectedValueOnce(new Error("disk"));
    useBoardStore.getState().setTaskTitle(task.id, "Borrador");
    await flushMicrotasks();
    persistVaultTasks.mockResolvedValueOnce(undefined);

    useBoardStore.getState().setTaskTitle(task.id, "Otra");

    expect(useBoardStore.getState().tasks[0]?.title).toBe("Otra");
  });

  it("cierra el aviso de guardado", async () => {
    const task = savedTask();
    persistVaultTasks.mockRejectedValueOnce(new Error("disk"));
    useBoardStore.getState().setTaskTitle(task.id, "Borrador");
    await flushMicrotasks();

    useBoardStore.getState().dismissSaveNotice();

    expect(useBoardStore.getState().saveNotice).toBeNull();
  });

  it("no pisa un cambio nuevo si falla un cifrado anterior", async () => {
    const task = savedTask();
    const rejectFirst = deferred();
    persistVaultTasks.mockImplementationOnce(() => rejectFirst.promise);
    persistVaultTasks.mockImplementationOnce(() => pending());

    useBoardStore.getState().setTaskTitle(task.id, "Uno");
    useBoardStore.getState().setTaskTitle(task.id, "Dos");
    rejectFirst.reject(new Error("disk"));
    await flushMicrotasks();

    expect(useBoardStore.getState().tasks[0]?.title).toBe("Dos");
  });

  it("restaura el último cifrado que sí terminó", async () => {
    const task = savedTask();
    const firstSave = deferred();
    const secondSave = deferred();
    persistVaultTasks.mockImplementationOnce(() => firstSave.promise);
    persistVaultTasks.mockImplementationOnce(() => secondSave.promise);

    useBoardStore.getState().setTaskTitle(task.id, "Uno");
    useBoardStore.getState().setTaskTitle(task.id, "Dos");
    firstSave.resolve();
    await flushMicrotasks();
    secondSave.reject(new Error("disk"));
    await flushMicrotasks();

    expect(useBoardStore.getState().tasks[0]?.title).toBe("Uno");
  });

  it("deshace el cambio si la bóveda ya está bloqueada", () => {
    const task = savedTask();
    const saved = useBoardStore.getState().tasks;
    persistVaultTasks.mockImplementationOnce(() => {
      throw new VaultError("La bóveda está bloqueada.");
    });

    renameOrIgnore(task, "Borrador");

    expect(useBoardStore.getState().tasks).toBe(saved);
  });

  it("avisa al formulario si la bóveda ya está bloqueada", () => {
    const task = savedTask();
    persistVaultTasks.mockImplementationOnce(() => {
      throw new VaultError("La bóveda está bloqueada.");
    });

    expect(() => {
      useBoardStore.getState().setTaskTitle(task.id, "Borrador");
    }).toThrow(VaultError);
  });
});

function renameOrIgnore(task: Task, title: string): void {
  try {
    useBoardStore.getState().setTaskTitle(task.id, title);
  } catch (error) {
    if (error instanceof VaultError) {
      return;
    }

    throw error;
  }
}

function savedTask(): Task {
  const task = savedTaskList()[0];
  if (task === undefined) {
    throw new Error("Falta la tarea de prueba.");
  }

  return task;
}

function savedTaskList(): Task[] {
  const tasks = [makeTestTask()];
  useBoardStore.getState().hydrate(tasks);
  return tasks;
}

function pending(): Promise<void> {
  return new Promise(() => undefined);
}

function deferred(): {
  promise: Promise<void>;
  reject: (error: unknown) => void;
  resolve: () => void;
} {
  let resolve: () => void = () => undefined;
  let reject: (error: unknown) => void = () => undefined;
  const promise = new Promise<void>((onResolve, onReject) => {
    resolve = () => {
      onResolve();
    };
    reject = (error: unknown) => {
      onReject(error);
    };
  });

  return { promise, reject, resolve };
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}
