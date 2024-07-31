// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import fs from "fs";
import path from "path";
import child_process from "child_process";
import { env } from "process";
import { defineConfig } from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/vite/dist/node/index.js";
import Vue from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Press, { matter } from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/vite-plugin-press/dist/index.mjs";
import Components from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/unplugin-vue-components/dist/vite.js";
import VueRouter from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/unplugin-vue-router/dist/vite.mjs";
import Layouts from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Markdown from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/unplugin-vue-markdown/dist/vite.js";
import svgLoader from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/vite-svg-loader/index.js";

// vite.config.markdown.ts
import container from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/markdown-it-container/index.mjs";
import prism from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/markdown-it-prism/build/index.js";
import anchor from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/markdown-it-anchor/dist/markdownItAnchor.js";
import Prism from "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/node_modules/prismjs/prism.js";
var FencedComponents = ["files"];
function vite_config_markdown_default(md, options = {}) {
  function copy({ cls, box, icon, txt }) {
    return {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<div class="${cls} flex cursor-pointer mb-3" onclick="copy(this)">
            <div class="flex-grow ${box || "bg-gray-700"}">
                <div class="pl-4 py-1 pb-1.5 align-middle ${txt || "text-lg text-white"}">`;
        } else {
          return `</div>
            </div>
            <div class="flex">
                <div class="${icon} text-white p-1.5 pb-0">
                    <svg class="copied w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <svg class="nocopy w-6 h-6" title="copy" fill='none' stroke='white' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'></path>
                    </svg>
                </div>
            </div>
        </div>
`;
        }
      }
    };
  }
  function alert({ title, cls }) {
    return {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          const useTitle = token.info.trim().substring(`${title} `.length).replace(/:+$/g, "") || title || "TIP";
          return `<div class="${cls || "tip"} custom-block">
                                <p class="custom-block-title">${useTitle}</p>`;
        } else {
          return `</div>`;
        }
      }
    };
  }
  function include() {
    return {
      validate(params) {
        return params.trim().match(/^include\s+(.*)$/);
      },
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<Include src="${token.info.trim().substring("include ".length).replace(/:+$/g, "")}" />`;
        } else {
          return ``;
        }
      }
    };
  }
  function youtube() {
    return {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<LiteYouTube id="${token.info.trim().substring("youtube ".length).replace(/:+$/g, "")}" />`;
        } else {
          return ``;
        }
      }
    };
  }
  md.linkify.set({ fuzzyLink: false });
  md.use(anchor, { permalink: anchor.permalink.headerLink() });
  md.use(prism);
  md.use((md2) => {
    const allComponents = [...options.fencedComponents || [], ...FencedComponents];
    allComponents.forEach((name) => {
      Prism.languages[name] = {};
    });
    const prismFence = md2.renderer.rules.fence;
    md2.renderer.rules.fence = function(tokens, idx, options2, env2, slf) {
      const token = tokens[idx];
      const info = token.info ? md2.utils.unescapeAll(token.info).trim() : "";
      const langName = info.split(/\s+/g)[0];
      if (allComponents.includes(langName)) {
        const tag = langName;
        const body = token.content.replace(/"/g, "&quot;").replace(/`/g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "\\`");
        return "<" + tag + ' :body="`' + body + '`" />';
      }
      return prismFence(tokens, idx, options2, env2, slf);
    };
  });
  md.use(container, "tip", alert({}));
  md.use(container, "info", alert({ title: "INFO", cls: "info" }));
  md.use(container, "warning", alert({ title: "WARNING", cls: "warning" }));
  md.use(container, "danger", alert({ title: "DANGER", cls: "danger" }));
  md.use(container, "copy", copy({ cls: "not-prose copy cp", icon: "bg-sky-500" }));
  md.use(container, "sh", copy({ cls: "not-prose sh-copy cp", box: "bg-gray-800", icon: "bg-green-600", txt: "whitespace-pre text-base text-gray-100" }));
  md.use(container, "include", include());
  md.use(container, "youtube", youtube());
  md.use(container, "dynamic", {
    validate: () => true,
    render: function(tokens, idx) {
      const token = tokens[idx];
      return token.nesting === 1 ? '<div class="' + token.info.trim().replace(/[{}.]/g, "") + '">' : "</div>";
    }
  });
  return md;
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///C:/upwork/cliff/AutomateDroneApp/AutomateDroneApp.Client/vite.config.ts";
var baseFolder = env.APPDATA !== void 0 && env.APPDATA !== "" ? `${env.APPDATA}/ASP.NET/https` : `${env.HOME}/.aspnet/https`;
var certificateArg = process.argv.map((arg) => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
var certificateName = certificateArg ? certificateArg.groups.value : "automatedroneapp.client";
if (!certificateName) {
  console.error("Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.");
  process.exit(-1);
}
var certFilePath = path.join(baseFolder, `${certificateName}.pem`);
var keyFilePath = path.join(baseFolder, `${certificateName}.key`);
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  if (0 !== child_process.spawnSync("dotnet", [
    "dev-certs",
    "https",
    "--export-path",
    certFilePath,
    "--format",
    "Pem",
    "--no-password"
  ], { stdio: "inherit" }).status) {
    throw new Error("Could not create certificate.");
  }
}
var target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` : env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(";")[0] : "https://localhost:5001";
var apiUrl = process.env.NODE_ENV === "development" ? target : "";
var baseUrl = process.env.NODE_ENV === "development" ? "https://locahost:5173" : process.env.DEPLOY_HOST ? `https://${process.env.DEPLOY_HOST}` : void 0;
var vite_config_default = defineConfig({
  define: { API_URL: `"${apiUrl}"` },
  plugins: [
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: [".vue", ".md"],
      dts: "src/typed-router.d.ts",
      extendRoute(route) {
        const filePath = route.node.value.components?.get("default");
        if (filePath && filePath.endsWith(".md")) {
          const md = fs.readFileSync(filePath, "utf-8");
          const { attributes: frontmatter } = matter(md);
          const pos = filePath.indexOf("/src/pages/");
          const crumbs = filePath.substring(pos + "/src/pages/".length).split("/").slice(0, -1).map((name) => ({ name, href: `/${name}` }));
          route.meta = Object.assign(route.meta || {}, { crumbs, frontmatter });
        }
      }
    }),
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Press({
      baseUrl,
      metadataPath: "public/api"
    }),
    Layouts(),
    svgLoader(),
    // https://github.com/unplugin/unplugin-vue-markdown
    Markdown({
      // default options passed to markdown-it
      // see: https://markdown-it.github.io/markdown-it/
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true
      },
      wrapperComponent: "MarkdownPage",
      headEnabled: true,
      markdownItSetup(md) {
        vite_config_markdown_default(md);
      }
    }),
    // https://github.com/unplugin/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue", "md"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      //dts: 'src/components.d.ts',
      dts: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    proxy: {
      "^/api": {
        target,
        secure: false
      }
    },
    port: 5173,
    https: {
      key: fs.readFileSync(keyFilePath),
      cert: fs.readFileSync(certFilePath)
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS5jb25maWcubWFya2Rvd24udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx1cHdvcmtcXFxcY2xpZmZcXFxcQXV0b21hdGVEcm9uZUFwcFxcXFxBdXRvbWF0ZURyb25lQXBwLkNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcdXB3b3JrXFxcXGNsaWZmXFxcXEF1dG9tYXRlRHJvbmVBcHBcXFxcQXV0b21hdGVEcm9uZUFwcC5DbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3Vwd29yay9jbGlmZi9BdXRvbWF0ZURyb25lQXBwL0F1dG9tYXRlRHJvbmVBcHAuQ2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHsgZW52IH0gZnJvbSAncHJvY2VzcydcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IFByZXNzLCB7IG1hdHRlciB9IGZyb20gJ3ZpdGUtcGx1Z2luLXByZXNzJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xuaW1wb3J0IExheW91dHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWxheW91dHMnXG5pbXBvcnQgTWFya2Rvd24gZnJvbSAndW5wbHVnaW4tdnVlLW1hcmtkb3duL3ZpdGUnXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcbmltcG9ydCBjb25maWd1cmVNYXJrZG93biBmcm9tICcuL3ZpdGUuY29uZmlnLm1hcmtkb3duJ1xuXG5jb25zdCBiYXNlRm9sZGVyID1cbiAgICBlbnYuQVBQREFUQSAhPT0gdW5kZWZpbmVkICYmIGVudi5BUFBEQVRBICE9PSAnJ1xuICAgICAgICA/IGAke2Vudi5BUFBEQVRBfS9BU1AuTkVUL2h0dHBzYFxuICAgICAgICA6IGAke2Vudi5IT01FfS8uYXNwbmV0L2h0dHBzYDtcblxuY29uc3QgY2VydGlmaWNhdGVBcmcgPSBwcm9jZXNzLmFyZ3YubWFwKGFyZyA9PiBhcmcubWF0Y2goLy0tbmFtZT0oPzx2YWx1ZT4uKykvaSkpLmZpbHRlcihCb29sZWFuKVswXTtcbmNvbnN0IGNlcnRpZmljYXRlTmFtZSA9IGNlcnRpZmljYXRlQXJnID8gY2VydGlmaWNhdGVBcmchLmdyb3VwcyEudmFsdWUgOiBcImF1dG9tYXRlZHJvbmVhcHAuY2xpZW50XCI7XG5cbmlmICghY2VydGlmaWNhdGVOYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcignSW52YWxpZCBjZXJ0aWZpY2F0ZSBuYW1lLiBSdW4gdGhpcyBzY3JpcHQgaW4gdGhlIGNvbnRleHQgb2YgYW4gbnBtL3lhcm4gc2NyaXB0IG9yIHBhc3MgLS1uYW1lPTw8YXBwPj4gZXhwbGljaXRseS4nKVxuICAgIHByb2Nlc3MuZXhpdCgtMSk7XG59XG5cbmNvbnN0IGNlcnRGaWxlUGF0aCA9IHBhdGguam9pbihiYXNlRm9sZGVyLCBgJHtjZXJ0aWZpY2F0ZU5hbWV9LnBlbWApO1xuY29uc3Qga2V5RmlsZVBhdGggPSBwYXRoLmpvaW4oYmFzZUZvbGRlciwgYCR7Y2VydGlmaWNhdGVOYW1lfS5rZXlgKTtcblxuaWYgKCFmcy5leGlzdHNTeW5jKGNlcnRGaWxlUGF0aCkgfHwgIWZzLmV4aXN0c1N5bmMoa2V5RmlsZVBhdGgpKSB7XG4gICAgaWYgKDAgIT09IGNoaWxkX3Byb2Nlc3Muc3Bhd25TeW5jKCdkb3RuZXQnLCBbXG4gICAgICAgICdkZXYtY2VydHMnLFxuICAgICAgICAnaHR0cHMnLFxuICAgICAgICAnLS1leHBvcnQtcGF0aCcsXG4gICAgICAgIGNlcnRGaWxlUGF0aCxcbiAgICAgICAgJy0tZm9ybWF0JyxcbiAgICAgICAgJ1BlbScsXG4gICAgICAgICctLW5vLXBhc3N3b3JkJyxcbiAgICBdLCB7IHN0ZGlvOiAnaW5oZXJpdCcsIH0pLnN0YXR1cykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgY3JlYXRlIGNlcnRpZmljYXRlLlwiKTtcbiAgICB9XG59XG5cbmNvbnN0IHRhcmdldCA9IGVudi5BU1BORVRDT1JFX0hUVFBTX1BPUlQgPyBgaHR0cHM6Ly9sb2NhbGhvc3Q6JHtlbnYuQVNQTkVUQ09SRV9IVFRQU19QT1JUfWAgOlxuICAgIGVudi5BU1BORVRDT1JFX1VSTFMgPyBlbnYuQVNQTkVUQ09SRV9VUkxTLnNwbGl0KCc7JylbMF0gOiAnaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSc7XG5jb25zdCBhcGlVcmwgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IHRhcmdldCA6ICcnXG5jb25zdCBiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcbiAgICA/IFwiaHR0cHM6Ly9sb2NhaG9zdDo1MTczXCJcbiAgICA6IHByb2Nlc3MuZW52LkRFUExPWV9IT1NUID8gYGh0dHBzOi8vJHtwcm9jZXNzLmVudi5ERVBMT1lfSE9TVH1gIDogdW5kZWZpbmVkXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIGRlZmluZTogeyBBUElfVVJMOiBgXCIke2FwaVVybH1cImAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3N2YS91bnBsdWdpbi12dWUtcm91dGVyXG4gICAgICAgIFZ1ZVJvdXRlcih7XG4gICAgICAgICAgICBleHRlbnNpb25zOiBbJy52dWUnLCAnLm1kJ10sXG4gICAgICAgICAgICBkdHM6ICdzcmMvdHlwZWQtcm91dGVyLmQudHMnLFxuICAgICAgICAgICAgZXh0ZW5kUm91dGUocm91dGU6YW55KSB7IFxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcm91dGUubm9kZS52YWx1ZS5jb21wb25lbnRzPy5nZXQoJ2RlZmF1bHQnKVxuICAgICAgICAgICAgICAgIGlmIChmaWxlUGF0aCAmJiBmaWxlUGF0aC5lbmRzV2l0aCgnLm1kJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGYtOCcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgYXR0cmlidXRlczpmcm9udG1hdHRlciB9ID0gbWF0dGVyKG1kKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSBmaWxlUGF0aC5pbmRleE9mKCcvc3JjL3BhZ2VzLycpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNydW1icyA9ICBmaWxlUGF0aC5zdWJzdHJpbmcocG9zICsgJy9zcmMvcGFnZXMvJy5sZW5ndGgpLnNwbGl0KCcvJykuc2xpY2UoMCwtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKG5hbWU6c3RyaW5nKSA9PiAoeyBuYW1lLCBocmVmOmAvJHtuYW1lfWAgfSkpXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlLm1ldGEgPSBPYmplY3QuYXNzaWduKHJvdXRlLm1ldGEgfHwge30sIHsgY3J1bWJzLCBmcm9udG1hdHRlciB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIFZ1ZSh7XG4gICAgICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXG4gICAgICAgIH0pLFxuXG4gICAgICAgIFByZXNzKHtcbiAgICAgICAgICAgIGJhc2VVcmwsXG4gICAgICAgICAgICBtZXRhZGF0YVBhdGg6J3B1YmxpYy9hcGknXG4gICAgICAgIH0pLFxuICAgICAgICBMYXlvdXRzKCksXG4gICAgICAgIHN2Z0xvYWRlcigpLFxuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bnBsdWdpbi91bnBsdWdpbi12dWUtbWFya2Rvd25cbiAgICAgICAgTWFya2Rvd24oe1xuICAgICAgICAgICAgLy8gZGVmYXVsdCBvcHRpb25zIHBhc3NlZCB0byBtYXJrZG93bi1pdFxuICAgICAgICAgICAgLy8gc2VlOiBodHRwczovL21hcmtkb3duLWl0LmdpdGh1Yi5pby9tYXJrZG93bi1pdC9cbiAgICAgICAgICAgIG1hcmtkb3duSXRPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsaW5raWZ5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHR5cG9ncmFwaGVyOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyYXBwZXJDb21wb25lbnQ6ICdNYXJrZG93blBhZ2UnLFxuICAgICAgICAgICAgaGVhZEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBtYXJrZG93bkl0U2V0dXAobWQ6YW55KSB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJlTWFya2Rvd24obWQpXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KSxcblxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW5wbHVnaW4vdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgICAgICAvLyBhbGxvdyBhdXRvIGxvYWQgbWFya2Rvd24gY29tcG9uZW50cyB1bmRlciBgLi9zcmMvY29tcG9uZW50cy9gXG4gICAgICAgICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxuXG4gICAgICAgICAgICAvLyBhbGxvdyBhdXRvIGltcG9ydCBhbmQgcmVnaXN0ZXIgY29tcG9uZW50cyB1c2VkIGluIG1hcmtkb3duXG4gICAgICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxuXG4gICAgICAgICAgICAvL2R0czogJ3NyYy9jb21wb25lbnRzLmQudHMnLFxuICAgICAgICAgICAgZHRzOnRydWUsXG4gICAgICAgIH0pLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgICAnXi9hcGknOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgIHNlY3VyZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcG9ydDogNTE3MyxcbiAgICAgICAgaHR0cHM6IHtcbiAgICAgICAgICAgIGtleTogZnMucmVhZEZpbGVTeW5jKGtleUZpbGVQYXRoKSxcbiAgICAgICAgICAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYyhjZXJ0RmlsZVBhdGgpLFxuICAgICAgICB9XG4gICAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcdXB3b3JrXFxcXGNsaWZmXFxcXEF1dG9tYXRlRHJvbmVBcHBcXFxcQXV0b21hdGVEcm9uZUFwcC5DbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHVwd29ya1xcXFxjbGlmZlxcXFxBdXRvbWF0ZURyb25lQXBwXFxcXEF1dG9tYXRlRHJvbmVBcHAuQ2xpZW50XFxcXHZpdGUuY29uZmlnLm1hcmtkb3duLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi91cHdvcmsvY2xpZmYvQXV0b21hdGVEcm9uZUFwcC9BdXRvbWF0ZURyb25lQXBwLkNsaWVudC92aXRlLmNvbmZpZy5tYXJrZG93bi50c1wiO2ltcG9ydCBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiXG5pbXBvcnQgY29udGFpbmVyIGZyb20gXCJtYXJrZG93bi1pdC1jb250YWluZXJcIlxuaW1wb3J0IHByaXNtIGZyb20gXCJtYXJrZG93bi1pdC1wcmlzbVwiXG5pbXBvcnQgYW5jaG9yIGZyb20gXCJtYXJrZG93bi1pdC1hbmNob3JcIlxuaW1wb3J0IFByaXNtIGZyb20gJ3ByaXNtanMnXG5cbmNvbnN0IEZlbmNlZENvbXBvbmVudHMgPSBbJ2ZpbGVzJ11cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWQ6TWFya2Rvd25JdCwgb3B0aW9uczogeyBmZW5jZWRDb21wb25lbnRzPzpzdHJpbmdbXSB9ID0ge30pIHtcbiAgICBmdW5jdGlvbiBjb3B5KHtjbHMsYm94LGljb24sdHh0fTphbnkpIHtcbiAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICByZW5kZXIodG9rZW5zOmFueSwgaWR4OmFueSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF1cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4ubmVzdGluZyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCIke2Nsc30gZmxleCBjdXJzb3ItcG9pbnRlciBtYi0zXCIgb25jbGljaz1cImNvcHkodGhpcylcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LWdyb3cgJHtib3h8fCdiZy1ncmF5LTcwMCd9XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBsLTQgcHktMSBwYi0xLjUgYWxpZ24tbWlkZGxlICR7dHh0fHwndGV4dC1sZyB0ZXh0LXdoaXRlJ31cIj5gXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXhcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtpY29ufSB0ZXh0LXdoaXRlIHAtMS41IHBiLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cImNvcGllZCB3LTYgaC02XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD1cIjJcIiBkPVwiTTUgMTNsNCA0TDE5IDdcIj48L3BhdGg+PC9zdmc+XG4gICAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJub2NvcHkgdy02IGgtNlwiIHRpdGxlPVwiY29weVwiIGZpbGw9J25vbmUnIHN0cm9rZT0nd2hpdGUnIHZpZXdCb3g9JzAgMCAyNCAyNCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCcgc3Ryb2tlLXdpZHRoPScxJyBkPSdNOCA3djhhMiAyIDAgMDAyIDJoNk04IDdWNWEyIDIgMCAwMTItMmg0LjU4NmExIDEgMCAwMS43MDcuMjkzbDQuNDE0IDQuNDE0YTEgMSAwIDAxLjI5My43MDdWMTVhMiAyIDAgMDEtMiAyaC0yTTggN0g2YTIgMiAwIDAwLTIgMnYxMGEyIDIgMCAwMDIgMmg4YTIgMiAwIDAwMi0ydi0yJz48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxcbmBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIGFsZXJ0KHt0aXRsZSxjbHN9OmFueSkge1xuICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAgIHJlbmRlcih0b2tlbnM6YW55LCBpZHg6YW55KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5uZXN0aW5nID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZVRpdGxlID0gdG9rZW4uaW5mby50cmltKCkuc3Vic3RyaW5nKGAke3RpdGxlfSBgLmxlbmd0aCkucmVwbGFjZSgvOiskL2csJycpIHx8IHRpdGxlIHx8ICdUSVAnXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIiR7Y2xzfHwndGlwJ30gY3VzdG9tLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiY3VzdG9tLWJsb2NrLXRpdGxlXCI+JHt1c2VUaXRsZX08L3A+YFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgPC9kaXY+YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5jbHVkZSgpIHtcbiAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICB2YWxpZGF0ZShwYXJhbXM6YW55KSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbXMudHJpbSgpLm1hdGNoKC9eaW5jbHVkZVxccysoLiopJC8pIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbmRlcih0b2tlbnM6YW55LCBpZHg6YW55KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5uZXN0aW5nID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgPEluY2x1ZGUgc3JjPVwiJHt0b2tlbi5pbmZvLnRyaW0oKS5zdWJzdHJpbmcoJ2luY2x1ZGUgJy5sZW5ndGgpLnJlcGxhY2UoLzorJC9nLCcnKX1cIiAvPmBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYGBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIHlvdXR1YmUoKSB7XG4gICAgICAgIHJldHVybiAoe1xuICAgICAgICAgICAgcmVuZGVyKHRva2VuczphbnksIGlkeDphbnkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLm5lc3RpbmcgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8TGl0ZVlvdVR1YmUgaWQ9XCIke3Rva2VuLmluZm8udHJpbSgpLnN1YnN0cmluZygneW91dHViZSAnLmxlbmd0aCkucmVwbGFjZSgvOiskL2csJycpfVwiIC8+YFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgYFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgXG4gICAgbWQubGlua2lmeS5zZXQoeyBmdXp6eUxpbms6IGZhbHNlIH0pXG4gICAgbWQudXNlKGFuY2hvciwge3Blcm1hbGluazogYW5jaG9yLnBlcm1hbGluay5oZWFkZXJMaW5rKCl9KVxuICAgIG1kLnVzZShwcmlzbSlcbiAgICBtZC51c2UoKG1kOmFueSkgPT4ge1xuICAgICAgICBjb25zdCBhbGxDb21wb25lbnRzID0gWy4uLihvcHRpb25zLmZlbmNlZENvbXBvbmVudHMgfHwgW10pLCAuLi5GZW5jZWRDb21wb25lbnRzXVxuICAgICAgICBhbGxDb21wb25lbnRzLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICBQcmlzbS5sYW5ndWFnZXNbbmFtZV0gPSB7fVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHByaXNtRmVuY2UgPSBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZVxuICAgICAgICBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9IGZ1bmN0aW9uICh0b2tlbnM6YW55LCBpZHg6YW55LCBvcHRpb25zOmFueSwgZW52OmFueSwgc2xmOmFueSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHRva2VuLmluZm8gPyBtZC51dGlscy51bmVzY2FwZUFsbCh0b2tlbi5pbmZvKS50cmltKCkgOiAnJ1xuICAgICAgICAgICAgY29uc3QgbGFuZ05hbWUgPSBpbmZvLnNwbGl0KC9cXHMrL2cpWzBdXG4gICAgICAgICAgICBpZiAoYWxsQ29tcG9uZW50cy5pbmNsdWRlcyhsYW5nTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWcgPSBsYW5nTmFtZVxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0b2tlbi5jb250ZW50LnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKS5yZXBsYWNlKC9gL2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpLnJlcGxhY2UoL2AvZywnXFxcXGAnKVxuICAgICAgICAgICAgICAgIHJldHVybiAnPCcgKyB0YWcgKyAnIDpib2R5PVwiYCcgKyBib2R5ICsgJ2BcIiAvPidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcmlzbUZlbmNlKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHNsZilcbiAgICAgICAgfVxuICAgIH0pXG4gICAgbWQudXNlKGNvbnRhaW5lciwgJ3RpcCcsIGFsZXJ0KHt9KSlcbiAgICBtZC51c2UoY29udGFpbmVyLCAnaW5mbycsIGFsZXJ0KHt0aXRsZTonSU5GTycsY2xzOidpbmZvJ30pKVxuICAgIG1kLnVzZShjb250YWluZXIsICd3YXJuaW5nJywgYWxlcnQoe3RpdGxlOidXQVJOSU5HJyxjbHM6J3dhcm5pbmcnfSkpXG4gICAgbWQudXNlKGNvbnRhaW5lciwgJ2RhbmdlcicsIGFsZXJ0KHt0aXRsZTonREFOR0VSJyxjbHM6J2Rhbmdlcid9KSlcbiAgICBtZC51c2UoY29udGFpbmVyLCAnY29weScsIGNvcHkoe2Nsczonbm90LXByb3NlIGNvcHkgY3AnLCBpY29uOidiZy1za3ktNTAwJ30pKVxuICAgIG1kLnVzZShjb250YWluZXIsICdzaCcsIGNvcHkoe2Nsczonbm90LXByb3NlIHNoLWNvcHkgY3AnLCBib3g6J2JnLWdyYXktODAwJywgaWNvbjonYmctZ3JlZW4tNjAwJywgdHh0Oid3aGl0ZXNwYWNlLXByZSB0ZXh0LWJhc2UgdGV4dC1ncmF5LTEwMCd9KSlcbiAgICBtZC51c2UoY29udGFpbmVyLCAnaW5jbHVkZScsIGluY2x1ZGUoKSlcbiAgICBtZC51c2UoY29udGFpbmVyLCAneW91dHViZScsIHlvdXR1YmUoKSlcbiAgICBtZC51c2UoY29udGFpbmVyLCAnZHluYW1pYycsIHtcbiAgICAgICAgdmFsaWRhdGU6ICgpID0+IHRydWUsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKHRva2VuczphbnksIGlkeDphbnkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF07XG4gICAgICAgICAgICByZXR1cm4gdG9rZW4ubmVzdGluZyA9PT0gMVxuICAgICAgICAgICAgICAgID8gJzxkaXYgY2xhc3M9XCInICsgdG9rZW4uaW5mby50cmltKCkucmVwbGFjZSgvW3t9Ll0vZywnJykgKyAnXCI+J1xuICAgICAgICAgICAgICAgIDogJzwvZGl2PidcbiAg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
