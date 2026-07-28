'use strict';

const isWin = process.platform === 'win32';
const backend = isWin ? 'cognition-wp.exe' : 'cognition-wp';
const rustDir = process.env.COG_RUST_TARGET
  ? `target/${process.env.COG_RUST_TARGET}/release`
  : 'target/release';

/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: 'com.cognitience.wp',
  productName: 'Cognitience WP',
  copyright: 'Copyright © Cognitience',
  directories: {
    output: 'dist',
    buildResources: 'build',
  },
  files: ['electron/**/*', 'package.json'],
  extraResources: [
    { from: `${rustDir}/${backend}`, to: `backend/${backend}` },
    { from: 'static', to: 'static' },
    { from: 'build/icon.png', to: 'build/icon.png' },
    ...(isWin ? [{ from: 'build/icon.ico', to: 'build/icon.ico' }] : []),
  ],
  asar: true,
  compression: 'maximum',
  publish: null,
  win: {
    icon: 'build/icon.ico',
    target: [{ target: 'portable', arch: ['x64'] }],
    artifactName: 'CognitienceWP_v${version}.${ext}',
  },
  portable: {
    artifactName: 'CognitienceWP_v${version}.${ext}',
  },
  mac: {
    icon: 'build/icon.png',
    category: 'public.app-category.productivity',
    target: ['zip'],
    artifactName: 'CognitienceWP_v${version}_mac_${arch}.${ext}',
    identity: null,
    hardenedRuntime: false,
    gatekeeperAssess: false,
  },
  afterPack: async (context) => {
    if (context.electronPlatformName !== 'darwin') return;
    const fs = require('fs');
    const path = require('path');
    const bin = path.join(
      context.appOutDir,
      'Cognitience WP.app',
      'Contents',
      'Resources',
      'backend',
      'cognition-wp'
    );
    if (fs.existsSync(bin)) fs.chmodSync(bin, 0o755);
  },
};
