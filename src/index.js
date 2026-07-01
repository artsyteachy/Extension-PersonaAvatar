const name = 'Persona Avatar';

export async function onInstall() {
    console.log(`${name} installed.`);
    // e.g. initialize default data, create storage entries
}

export async function onActivate() {
    console.log(`${name} activated. `);
    // e.g. do stuff
}

export async function onUpdate() {
    console.log(`${name} updated.`);
    // e.g. migrate data from old format to new format
}

export function onEnable() {
    console.log(`${name} enabled.`);
}

export function onDisable() {
    console.log(`${name} disabled.`);
}

export async function onClean() {
    console.log(`${name} cleaned.`);
    // e.g. cleanup of the extension`s data here
}

export async function onUninstall() {
    console.log(`${name} uninstalled!`);
    // e.g. remove stored data, delete storage entries
}
