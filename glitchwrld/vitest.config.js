"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var plugin_react_swc_1 = require("@vitejs/plugin-react-swc");
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, plugin_react_swc_1.default)()],
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
