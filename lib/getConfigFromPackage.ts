export async function getConfigFromPackageJson(attempts) {
  attempts = attempts || 1;
  if (attempts > 5) {
    throw new Error("Can't resolve main package.json file");
  }

  const mainPath = attempts === 1 ? './' : Array(attempts).join('../');
  const fullPath = mainPath + 'package.json';

  console.log('Trying to load package.json from', fullPath);

  try {
    return await import(fullPath, {
      with: { type: 'json' },
    });
  } catch (e) {
    console.error('Failed to load package.json from', fullPath, e);
    return getConfigFromPackageJson(attempts + 1);
  }
}
