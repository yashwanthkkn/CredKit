export function checkNodeVersion(minVersion = '18.0.0') {
    const currentVersion = process.versions.node;

    const isVersionValid = (current, minimum) => {
        const c = current.split('.').map(Number);
        const m = minimum.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
            if (c[i] > m[i]) return true;
            if (c[i] < m[i]) return false;
        }
        return true; // equal
    };

    if (!isVersionValid(currentVersion, minVersion)) {
        console.error(
            `❌ Node.js version ${minVersion} or higher is required. Current version: ${currentVersion}`
        );
        process.exit(1);
    }
}