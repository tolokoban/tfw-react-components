/**
 * Manage material design like CSS styles.
 */
export default { register: registerTheme, apply: applyTheme };

interface IStyle {
    bg0?: string;
    bg1?: string;
    bg2?: string;
    bg3?: string;
    bgP?: string;
    bgPD?: string;
    bgPL?: string;
    bgS?: string;
    bgSD?: string;
    bgSL?: string;
    fg0?: string;
    fg1?: string;
    fg2?: string;
    fg3?: string;
    fgP?: string;
    fgPD?: string;
    fgPL?: string;
    fgS?: string;
    fgSD?: string;
    fgSL?: string;
    black?: string;
    white?: string;
};


//################################################################################

import "./theme.css"
import Color from "./color"

interface IThemes {
    css: { [name: string]: HTMLStyleElement };
    current: string | null;
}

// Used for luminance computations. Because we need to know which text color
// can be used based on the background's luminance.
const COLOR = new Color();

const THEME_COLOR_NAMES = ["0", "1", "2", "3", "P", "PD", "PL", "S", "SD", "SL"];
const THEMES: IThemes = {
    css: {},
    current: null
};

function registerTheme(themeName: string, _style: IStyle) {
    const style = completeWithDefaultValues(_style);

    let codeCSS = codeVariables(themeName, style);
    codeCSS += codeBackground(themeName, style);
    codeCSS += codeElevation(themeName, style);
    codeCSS += codeText(themeName, style);

    let styleElement = THEMES.css[themeName];
    if (!styleElement) {
        styleElement = document.createElement("style");
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        THEMES.css[themeName] = styleElement;
    }

    styleElement.textContent = codeCSS;
}

function codeText(themeName: string, style: IStyle) {
    let codeCSS = '';
    for (let depth = 1; depth <= 10; depth++) {
        THEME_COLOR_NAMES.forEach(function(colorName) {
            const fgColorName = `fg${colorName}`;
            const bgColorName = `bg${colorName}`;
            const styleFgColorName: string = style[fgColorName] as string;
            const styleBgColorName: string = style[bgColorName] as string;
            const bgClass = ".thm-bg" + colorName;
            const fgClass = ".thm-fg" + colorName;
            for (let position = 1; position <= depth; position++) {
                const piecesFG = [];
                const piecesSVG = [];
                const piecesBG = [];
                for (let index = 1; index <= depth; index++) {
                    piecesBG.push(position === index ? bgClass : '*');
                    piecesSVG.push(position === index ? bgClass : '*');
                    piecesFG.push(position === index ? fgClass : '*');
                    if (index === depth) {
                        piecesBG.push(piecesBG.pop() + ".thm-fg");
                        piecesFG.push(piecesFG.pop() + fgClass);
                    }
                }
                codeCSS += "body.dom-theme-" + themeName + " "
                    + piecesBG.join(" > ")
                    + " { color: " + styleFgColorName + " }\n";
                codeCSS += "body.dom-theme-" + themeName + " "
                    + piecesFG.join(" > ")
                    + " { color: " + styleBgColorName + " }\n";
                codeCSS += "body.dom-theme-" + themeName + " "
                    + piecesSVG.join(" > ")
                    + " .thm-svg-fill0"
                    + " { fill: " + styleFgColorName + " }\n";
                codeCSS += "body.dom-theme-" + themeName + " "
                    + piecesSVG.join(" > ")
                    + " .thm-svg-stroke0"
                    + " { stroke: " + styleFgColorName + " }\n";
            }
        });
    }
    return codeCSS;
}

function codeVariables(themeName: string, style: IStyle) {
    let codeCSS = "body.dom-theme-" + themeName + '{\n';
    THEME_COLOR_NAMES.forEach(function(colorName) {
        const s = style[`bg${colorName}`] as string;
        codeCSS += `  --thm-bg${colorName}: ${s};\n`;
    });
    codeCSS += "}\n";
    return codeCSS;
}


function codeBackground(themeName: string, style: IStyle) {
    var codeCSS = '';
    THEME_COLOR_NAMES.forEach(function(colorName) {
        codeCSS += "body.dom-theme-" + themeName + ".thm-bg" + colorName
            + " { background-color: " + style[`bg${colorName}`] + " }\n";
        codeCSS += "body.dom-theme-" + themeName + " .thm-fg" + colorName
            + " { color: " + style[`fg${colorName}`] + " }\n";
        codeCSS += "body.dom-theme-" + themeName + " .thm-bg" + colorName
            + " { background-color: " + style[`bg${colorName}`] + " }\n";
        codeCSS += "body.dom-theme-" + themeName + " .thm-bg" + colorName + "-bottom"
            + " { background: linear-gradient(to top,"
            + style[`bg${colorName}`] + ",transparent) }\n";
        codeCSS += "body.dom-theme-" + themeName + " .thm-bg" + colorName + "-top"
            + " { background: linear-gradient(to bottom,"
            + style[`bg${colorName}`] + ",transparent) }\n";
        codeCSS += "body.dom-theme-" + themeName + " .thm-bg" + colorName + "-left"
            + " { background: linear-gradient(to right,"
            + style[`bg${colorName}`] + ",transparent) }\n";
        codeCSS += "body.dom-theme-" + themeName + " .thm-bg" + colorName + "-right"
            + " { background: linear-gradient(to left,"
            + style[`bg${colorName}`] + ",transparent) }\n";

        if (!isNaN(parseInt(colorName))) return;
        codeCSS += "body.dom-theme-" + themeName + " .thm-svg-fill" + colorName
            + " { fill: "
            + style[`bg${colorName}`] + " }\n";
        codeCSS += "body.dom-theme-" + themeName + " .thm-svg-stroke" + colorName
            + " { stroke: "
            + style[`bg${colorName}`] + " }\n";
    });
    return codeCSS;
}

function codeElevation(themeName: string, style: IStyle) {
    COLOR.parse(style.bg2);
    const luminance = COLOR.luminance();
    var elevationColor = luminance < .6
        ? addAlpha(style.white, Math.ceil(10 * luminance))
        : addAlpha(style.black, '6');
    var codeCSS = '';
    [0, 1, 2, 3, 4, 6, 8, 9, 12, 16, 24].forEach(function(elevation) {
        codeCSS += "body.dom-theme-" + themeName + " .thm-ele" + elevation + " {\n"
            + "  box-shadow: 0 " + elevation + "px " + (2 * elevation) + "px " + elevationColor + "\n"
            + "}\n";
    });
    return codeCSS;
}

function applyTheme(name: string, target: HTMLElement = document.body) {
    if (!THEMES.css[name]) {
        console.error("This theme has not been registered: ", name);
        return;
    }
    var body = document.body;
    if (typeof THEMES.current === 'string') {
        body.classList.remove(`dom-theme-${THEMES.current}`);
    }
    THEMES.current = name;
    body.classList.add(`dom-theme-${THEMES.current}`);
}

function completeWithDefaultValues(style: IStyle) {
    if (typeof style === 'undefined') style = {};
    if (typeof style.bg0 !== 'string') style.bg0 = "#E0E0E0";
    if (typeof style.bg1 !== 'string') style.bg1 = "#F5F5F5";
    if (typeof style.bg2 !== 'string') style.bg2 = "#FAFAFA";
    if (typeof style.bg3 !== 'string') style.bg3 = "#FFF";

    if (typeof style.bgP !== 'string') style.bgP = "#3E50B4";
    if (typeof style.bgPD !== 'string') style.bgPD = dark(style.bgP);
    if (typeof style.bgPL !== 'string') style.bgPL = light(style.bgP);
    if (typeof style.bgS !== 'string') style.bgS = "#FF3F80";
    if (typeof style.bgSD !== 'string') style.bgSD = dark(style.bgS);
    if (typeof style.bgSL !== 'string') style.bgSL = light(style.bgS);

    if (typeof style.white === 'undefined') style.white = '#fff';
    if (typeof style.black === 'undefined') style.black = '#000';


    THEME_COLOR_NAMES.forEach(function(name) {
        const bg: string = style[`bg${name}`];
        COLOR.parse(bg);
        var luminance = COLOR.luminance();
        style[`fg${name}`] = luminance < .6 ? style.white : style.black;
    });

    return style;
}

function dark(color: string) {
    const percent = .25;
    COLOR.parse(color);
    COLOR.rgb2hsl();
    COLOR.L *= 1 - percent;
    COLOR.hsl2rgb();
    return COLOR.stringify();
}

function light(color: string) {
    var percent = .4;
    COLOR.parse(color);
    COLOR.rgb2hsl();
    COLOR.L = percent + (1 - percent) * COLOR.L;
    COLOR.hsl2rgb();
    return COLOR.stringify();
}


/**
 * @param {string} color - RGB color in format #xxx or #xxxxxx.
 * @param {string} alpha - Single char between 0 and F.
 */
function addAlpha(color, alpha) {
    if (color.length < 5) return color + alpha;
    return color + alpha + alpha;
}
