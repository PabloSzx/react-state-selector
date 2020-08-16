module.exports = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: [
    "@storybook/preset-create-react-app",
    {
      name: "@storybook/addon-storysource",
      options: {
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: false },
          parser: "typescript",
        },
      },
    },
  ],
};
