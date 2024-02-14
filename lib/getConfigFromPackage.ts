export async function getConfigFromPackageJson(attempts) {
  attempts = attempts || 1;
  if (attempts > 5) {
    throw new Error("Can't resolve main package.json file");
  }

  const mainPath = attempts === 1 ? './' : Array(attempts).join('../');
  const fullPath = mainPath + 'package.json';

  try {
    return await import(fullPath, {
      assert: { type: 'json' },
    });
  } catch (e) {
    return getConfigFromPackageJson(attempts + 1);
  }
}
