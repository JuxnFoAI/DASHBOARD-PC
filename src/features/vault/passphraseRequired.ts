let passphraseRequired = true;

export function isPassphraseRequired(): boolean {
  return passphraseRequired;
}

export function setPassphraseRequired(required: boolean): void {
  passphraseRequired = required;
}
