import "@storybook/addon-links/register";

import { addons } from "@storybook/addons";
import { create, themes } from "@storybook/theming";

addons.setConfig({
  theme: create(themes.dark, {
    textColor: "white",
    brandTitle: "react-state-selector",
    brandUrl: "https://github.com/PabloSzx/react-state-selector",
    brandImage:
      "https://pabloszx.github.io/react-state-selector/android-chrome-512x512.png",
  }),
});
