module.exports = {
  testDir: '.',
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        permissions: ['camera', 'microphone'],
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },
  ],
};
