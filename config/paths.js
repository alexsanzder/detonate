const path = require('path');
const fs = require('fs');
const url = require('url');

const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL,
);
const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = (appPackageJson) => envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('extension'),
  appPublic: resolveApp('public'),
  appPages: [
    {
      name: 'popup',
      title: 'popup',
      appHtml: resolveApp('src/popup/template.html'),
      appIndexJs: resolveModule(resolveApp, 'src/popup/index'),
    },
    {
      name: 'content-script',
      title: 'content-script',
      appHtml: resolveApp('src/content_scripts/template.html'),
      appIndexJs: resolveModule(resolveApp, 'src/content_scripts/index'),
    },
    {
      name: 'background',
      title: 'background',
      appHtml: resolveApp('src/background/template.html'),
      appIndexJs: resolveModule(resolveApp, 'src/background/index'),
    },
    {
      name: 'options',
      title: 'options',
      appHtml: resolveApp('src/options/template.html'),
      appIndexJs: resolveModule(resolveApp, 'src/options/index'),
    },
    {
      name: 'sidebar',
      title: 'sidebar',
      appHtml: resolveApp('src/sidebar/template.html'),
      appIndexJs: resolveModule(resolveApp, 'src/sidebar/index'),
    },
  ],
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  publicUrlOrPath,
};
module.exports.moduleFileExtensions = moduleFileExtensions;
