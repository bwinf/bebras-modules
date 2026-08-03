/*
 * Zusätzliche JwInf-Bedienelemente für Codecast 7.7
 *
 * Fügt dem Codecast-Menü folgende Aktionen hinzu:
 * - Kopieren
 * - Einfügen
 * - Rückgängig
 * - Wiederherstellen
 * - SVG-Esporte
 *
 * Korrigiert außerdem die Blockly-Farben der Codecast-Printer-Lib
 * und kann deren Feld Erwartete Ausgabe ausblenden.
 *
 * Ergänzt außerdem den Variablen-Manager um Funktionsparameter
 * und getrennte Aufruf-Frames.
 */

(function () {
    "use strict";

    var toastTimer = null;
    var observerScheduled = false;
    var localizedAceInstance = null;
    var blocklyResizeHandlerInstalled = false;
    var blocklyEnhancementsDirty = true;

    /* ---------------------------------------------------------
     * Konfiguration
     * --------------------------------------------------------- */

    function getSettings() {
        var parameters =
            window.taskData &&
                window.taskData.codecastParameters
                ? window.taskData.codecastParameters
                : {};

        var settings = parameters.jwinfMenu || {};

        return {
            /*
            * Kopieren sowie Rückgängig bleiben standardmäßig aktiv
            */
            copyPaste: settings.copyPaste !== false,
            undoRedo: settings.undoRedo !== false,

            svgExport: settings.svgExport === true
        };
    }


    function usesBlockly() {
        var parameters =
            window.taskData &&
                window.taskData.codecastParameters
                ? window.taskData.codecastParameters
                : {};

        /*
         * Ohne explizite Plattform warten wir darauf, dass Blockly
         * verfügbar ist. Ansonsten nur Blockly/Scratch unterstützen.
         */
        return (
            !parameters.platform ||
            parameters.platform === "blockly" ||
            parameters.platform === "scratch"
        );
    }

    /* ---------------------------------------------------------
     * Codecast-Printer: Farben und erwartete Ausgabe
     * --------------------------------------------------------- */

    var bwinfBlocklyColours = {
        categories: {
            logic: "#81b31d",
            loops: "#2fb5bd",
            math: "#3950a5",
            texts: "#6638a5",
            lists: "#d8892b",
            colour: 310,
            read: "#a50101",
            print: "#dac221",
            variables: "#a5416b",
            manipulate: "#26885f",
            _default: 280
        },
        blocks: {}
    };


    function getCodecastParameters() {
        if (
            window.taskData &&
            window.taskData.codecastParameters
        ) {
            return window.taskData.codecastParameters;
        }

        if (
            window.Codecast &&
            window.Codecast.options
        ) {
            return window.Codecast.options;
        }

        return {};
    }


    function copyBwinfBlocklyColours() {
        return {
            categories: Object.assign(
                {},
                bwinfBlocklyColours.categories
            ),
            blocks: {}
        };
    }


    function getMainQuickAlgoContext() {
        var loadedLibraries =
            window.quickAlgoLoadedLibraries;

        var librariesByName;
        var libraryNames;
        var context;
        var i;

        if (
            loadedLibraries &&
            typeof loadedLibraries.getAllLibrariesByName ===
            "function"
        ) {
            try {
                librariesByName =
                    loadedLibraries.getAllLibrariesByName(
                        "main"
                    );
            } catch (error) {
                librariesByName = null;
            }

            if (librariesByName) {
                if (librariesByName.printer) {
                    return librariesByName.printer;
                }

                libraryNames = Object.keys(
                    librariesByName
                );

                for (i = 0; i < libraryNames.length; i++) {
                    context =
                        librariesByName[libraryNames[i]];

                    if (isPrinterContext(context)) {
                        return context;
                    }
                }
            }
        }

        if (
            loadedLibraries &&
            typeof loadedLibraries.getContext === "function"
        ) {
            try {
                context = loadedLibraries.getContext(
                    null,
                    "main"
                );
            } catch (error) {
                context = null;
            }

            if (context) {
                return context;
            }
        }

        /*
         * Fallback für Codecast-Stände, bei denen nur der Runner
         * den aktuellen QuickAlgo-Kontext öffentlich erreichbar macht.
         */
        return (
            window.Codecast &&
                window.Codecast.runner &&
                window.Codecast.runner.context
                ? window.Codecast.runner.context
                : null
        );
    }


    function usesBwinfBlocklyColourTheme(context) {
        var taskData = window.taskData || {};
        var parameters = getCodecastParameters();
        var theme =
            context &&
                context.infos
                ? context.infos.blocklyColourTheme
                : null;

        if (!theme && taskData.gridInfos) {
            theme = taskData.gridInfos.blocklyColourTheme;
        }

        if (!theme) {
            theme = taskData.blocklyColourTheme;
        }

        if (!theme) {
            theme = parameters.blocklyColourTheme;
        }

        return theme === "bwinf";
    }


    function isPrinterContext(context) {
        var taskData = window.taskData || {};
        var parameters = getCodecastParameters();
        var contextName =
            context && context.infos
                ? context.infos.context
                : null;

        if (!contextName && taskData.gridInfos) {
            contextName = taskData.gridInfos.context;
        }

        if (!contextName) {
            contextName = taskData.context;
        }

        if (!contextName) {
            contextName = parameters.context;
        }

        /*
         * In manchen eingebetteten Aufgaben wird der Kontextname
         * nicht bis taskData durchgereicht. Die Printer-Lib ist dann
         * noch an ihrer eigenen Blockgruppe erkennbar.
         */
        return (
            contextName === "printer" ||
            (
                !contextName &&
                context &&
                context.customBlocks &&
                context.customBlocks.printer
            )
        );
    }

    function isPythonPlatform() {
        var platform = window.currentPlatform;

        if (
            typeof platform === "string" &&
            platform !== ""
        ) {
            return platform === "python";
        }

        return getCurrentCodecastPlatform() === "python";
    }

    var legacyPythonPrinterNames = {
        print: "schreibe",
        print_end: "schreibe",
        read: "lies",
        readInteger: "liesGanzzahl",
        readFloat: "liesKommazahl",
        eof: "eingabeEnde",
        charToNumber: "zeichenZuZahl",
        numberToChar: "zahlZuZeichen",
        asciiToChar: "zeichenZuAscii",
        charToAscii: "asciiZuZeichen"
    };


    function addLegacyPrinterNamesToIncludeBlocks(
        includeBlocks
    ) {
        var generatedBlocks =
            includeBlocks && includeBlocks.generatedBlocks;

        var printerBlocks =
            generatedBlocks &&
                Array.isArray(generatedBlocks.printer)
                ? generatedBlocks.printer
                : null;

        var changed = false;

        if (!printerBlocks) {
            return false;
        }

        Object.keys(legacyPythonPrinterNames).forEach(
            function (blockName) {
                var legacyName =
                    legacyPythonPrinterNames[blockName];

                if (
                    printerBlocks.indexOf(blockName) !== -1 &&
                    printerBlocks.indexOf(legacyName) === -1
                ) {
                    printerBlocks.push(legacyName);
                    changed = true;
                }
            }
        );

        return changed;
    }


    function copyIncludeBlocksWithLegacyPrinterNames(
        includeBlocks
    ) {
        var generatedBlocks =
            includeBlocks && includeBlocks.generatedBlocks;

        var printerBlocks =
            generatedBlocks &&
                Array.isArray(generatedBlocks.printer)
                ? generatedBlocks.printer
                : null;

        var nextPrinterBlocks;
        var nextGeneratedBlocks;
        var nextIncludeBlocks;

        /*
         * Die alten Namen ausschließlich für Python ergänzen.
         * Ohne Printer-Konfiguration gibt es nichts zu kopieren.
         */
        if (
            !printerBlocks ||
            !isPythonPlatform()
        ) {
            return null;
        }

        nextPrinterBlocks = printerBlocks.slice();

        nextGeneratedBlocks = Object.assign(
            {},
            generatedBlocks,
            {
                printer: nextPrinterBlocks
            }
        );

        nextIncludeBlocks = Object.assign(
            {},
            includeBlocks,
            {
                generatedBlocks: nextGeneratedBlocks
            }
        );

        if (
            !addLegacyPrinterNamesToIncludeBlocks(
                nextIncludeBlocks
            )
        ) {
            return null;
        }

        return nextIncludeBlocks;
    }


    function ensureLegacyPythonPrinterNames(context) {
        var customPrinterBlocks =
            context &&
                context.customBlocks &&
                context.customBlocks.printer
                ? context.customBlocks.printer
                : null;

        var printer = context && context.printer;
        var nextIncludeBlocks;
        var includeBlocks =
            context &&
                context.infos &&
                context.infos.includeBlocks
                ? context.infos.includeBlocks
                : null;

        if (
            !customPrinterBlocks ||
            !printer ||
            !isPythonPlatform()
        ) {
            return;
        }

        /*
         * Verborgene Blockdefinitionen sorgen dafür, dass Codecast
         * die alten Namen weiterhin in das Python-Modul "printer"
         * aufnimmt. Wegen hidden erscheinen sie weder in der
         * Funktionsliste noch in der Autovervollständigung.
         */
        Object.keys(customPrinterBlocks).forEach(
            function (categoryName) {
                var blocks =
                    customPrinterBlocks[categoryName];

                if (!Array.isArray(blocks)) {
                    return;
                }

                blocks.slice().forEach(function (block) {
                    var legacyName;
                    var alreadyExists;

                    if (!block || !block.name) {
                        return;
                    }

                    legacyName =
                        legacyPythonPrinterNames[block.name];

                    if (!legacyName) {
                        return;
                    }

                    alreadyExists =
                        Object.keys(
                            customPrinterBlocks
                        ).some(function (otherCategory) {
                            var otherBlocks =
                                customPrinterBlocks[
                                otherCategory
                                ];

                            return (
                                Array.isArray(otherBlocks) &&
                                otherBlocks.some(
                                    function (otherBlock) {
                                        return (
                                            otherBlock &&
                                            otherBlock.name ===
                                            legacyName
                                        );
                                    }
                                )
                            );
                        });

                    if (alreadyExists) {
                        return;
                    }

                    blocks.push(
                        Object.assign(
                            {},
                            block,
                            {
                                name: legacyName,
                                hidden: true
                            }
                        )
                    );
                });
            }
        );

        /*
         * Alte Aufgaben verwendeten für normales Schreiben und
         * Schreiben mit Endzeichen denselben Namen. Ein Aufruf mit
         * zwei Nutzargumenten wird deshalb weiterhin als print_end
         * behandelt. Das vom Executor ergänzte Callback ist das
         * jeweils letzte Argument.
         */
        if (
            printer.__jwinfLegacyPrinterNames !== true
        ) {
            printer.__jwinfLegacyPrinterNames = true;

            printer.schreibe = function () {
                var userArgumentCount =
                    Math.max(0, arguments.length - 1);

                if (
                    userArgumentCount === 2 &&
                    typeof printer.print_end === "function"
                ) {
                    return printer.print_end.apply(
                        this,
                        arguments
                    );
                }

                return printer.print.apply(
                    this,
                    arguments
                );
            };

            Object.keys(
                legacyPythonPrinterNames
            ).forEach(function (blockName) {
                var legacyName =
                    legacyPythonPrinterNames[blockName];

                if (
                    legacyName !== "schreibe" &&
                    typeof printer[blockName] ===
                    "function"
                ) {
                    printer[legacyName] =
                        printer[blockName];
                }
            });
        }

        nextIncludeBlocks =
            copyIncludeBlocksWithLegacyPrinterNames(
                includeBlocks
            );

        if (nextIncludeBlocks) {
            /*
             * Die ursprüngliche Aufgabenkonfiguration nicht verändern.
             * Sonst könnten die Python-Aliasse bei einem späteren Wechsel
             * zu Blockly dort ebenfalls auftauchen.
             */
            context.infos = Object.assign(
                {},
                context.infos,
                {
                    includeBlocks: nextIncludeBlocks
                }
            );
        }
    }


    function installLegacyPrinterBuiltinsForRunner(runner) {
        var originalInjectFunctions;

        if (
            !runner ||
            runner.__jwinfLegacyPrinterBuiltins === true ||
            typeof runner._injectFunctions !== "function" ||
            typeof runner._createBuiltin !== "function"
        ) {
            return;
        }

        originalInjectFunctions = runner._injectFunctions;
        runner.__jwinfLegacyPrinterBuiltins = true;

        /*
         * Jeder Haupt- und Hintergrundtest hat seinen eigenen Runner.
         * Deshalb müssen die alten Namen fest an genau diesen Runner
         * gebunden werden.
         */
        runner._injectFunctions = function () {
            var result =
                originalInjectFunctions.apply(this, arguments);

            var Sk = window.Sk;
            var builtins = Sk && Sk.builtins;

            var blocks = Array.isArray(this.availableBlocks)
                ? this.availableBlocks
                : [];

            var seenNames = {};
            var currentRunner = this;

            if (!builtins) {
                return result;
            }

            blocks.forEach(function (block) {
                var legacyName = block && block.name;

                if (
                    !legacyName ||
                    seenNames[legacyName] ||
                    block.generatorName !== "printer" ||
                    Object.keys(
                        legacyPythonPrinterNames
                    ).every(function (blockName) {
                        return (
                            legacyPythonPrinterNames[
                            blockName
                            ] !== legacyName
                        );
                    })
                ) {
                    return;
                }

                seenNames[legacyName] = true;

                /*
                 * Fester Wert statt eines dynamischen Getters.
                 * So greift ein Hintergrundtest nicht versehentlich
                 * auf den Runner des sichtbaren Tests zu.
                 */
                try {
                    Object.defineProperty(
                        builtins,
                        legacyName,
                        {
                            configurable: true,
                            enumerable: true,
                            writable: true,
                            value:
                                currentRunner._createBuiltin(
                                    legacyName,
                                    "printer",
                                    legacyName,
                                    block.paramsCount || null,
                                    block.type || "function"
                                )
                        }
                    );
                } catch (_) {
                    builtins[legacyName] =
                        currentRunner._createBuiltin(
                            legacyName,
                            "printer",
                            legacyName,
                            block.paramsCount || null,
                            block.type || "function"
                        );
                }
            });

            return result;
        };
    }


    function installPrinterRunnerHook(context) {
        var currentRunner;

        if (
            !context ||
            context.__jwinfPrinterRunnerHook === true
        ) {
            return;
        }

        currentRunner = context.runner;

        try {
            Object.defineProperty(
                context,
                "runner",
                {
                    configurable: true,
                    enumerable: true,

                    get: function () {
                        return currentRunner;
                    },

                    set: function (runner) {
                        currentRunner = runner;

                        installLegacyPrinterBuiltinsForRunner(
                            runner
                        );
                    }
                }
            );

            context.__jwinfPrinterRunnerHook = true;
        } catch (_) {
            /*
             * Falls runner später nicht mehr konfigurierbar ist,
             * bleiben zumindest die verborgenen Modulnamen aktiv.
             */
        }

        installLegacyPrinterBuiltinsForRunner(
            currentRunner
        );
    }


    function ensurePythonicPrinterNames(context) {
        var strings =
            context && context.strings
                ? context.strings
                : null;

        var code =
            strings && strings.code
                ? strings.code
                : null;

        if (!code || !isPrinterContext(context)) {
            return;
        }

        ensureLegacyPythonPrinterNames(context);
        installPrinterRunnerHook(context);

        /*
         * Die Blockly-Beschriftungen bleiben deutsch.
         * Im Python-Code verwenden wir die echten Namen.
         */
        code.print = "print";
        code.print_end = "print_end";
        code.read = "input";
    }

    function localizePrinterMessages(context) {
        var language = (
            window.stringsLanguage || ""
        ).toLowerCase();

        var messages =
            context &&
            context.strings &&
            context.strings.messages;

        if (
            language.indexOf("de") !== 0 ||
            !messages
        ) {
            return;
        }

        messages.inputPrompt =
            "Bitte gib eine Eingabezeile für das Programm ein.";

        messages.inputEmpty =
            "Dein Programm hat versucht, eine Eingabezeile " +
            "zu lesen, obwohl keine Eingabe mehr vorhanden ist!";
    }

    function ensureGermanCodecastMessages() {
        var language = (
            window.stringsLanguage || ""
        ).toLowerCase();

        var loadedLibraries =
            window.quickAlgoLoadedLibraries;

        var contexts = [];
        var context;

        if (language.indexOf("de") !== 0) {
            return;
        }

        /*
         * Haupt- und Hintergrundkontext erfassen.
         */
        if (
            loadedLibraries &&
            typeof loadedLibraries.getAllLibraries ===
            "function"
        ) {
            try {
                contexts =
                    loadedLibraries.getAllLibraries();
            } catch (error) {
                contexts = [];
            }
        }

        if (contexts.length === 0) {
            context = getMainQuickAlgoContext();

            if (context) {
                contexts.push(context);
            }
        }

        contexts.forEach(function (currentContext) {
            var messages;
            var blocklyStrings;

            if (!currentContext) {
                return;
            }

            /*
             * Fehlender Schlüssel im Codecast-Blockly-Runner.
             */
            blocklyStrings =
                currentContext.blocklyHelper &&
                currentContext.blocklyHelper.strings;

            if (blocklyStrings) {
                blocklyStrings.uninitializedlet =
                    "Nicht initialisierte Variable:";
            }

            if (isPrinterContext(currentContext)) {
                preparePrinterContext(currentContext);
            }

            messages =
                currentContext.strings &&
                currentContext.strings.messages;

            if (!messages) {
                return;
            }

            // /*
            //  * Englische Texte der in Codecast 7.7 eingebauten
            //  * Printer-Lib ersetzen.
            //  */
            // if (isPrinterContext(currentContext)) {
            //     messages.inputPrompt =
            //         "Bitte gib eine Eingabezeile für das Programm ein.";

            //     messages.inputEmpty =
            //         "Dein Programm hat versucht, eine Eingabezeile " +
            //         "zu lesen, obwohl keine Eingabe mehr vorhanden ist!";
            // }

            /*
             * Nebenfund in der Turtle-Lib.
             */
            if (
                typeof messages.paintingFree === "string" &&
                messages.paintingFree.indexOf(
                    "La tortue"
                ) === 0
            ) {
                messages.paintingFree =
                    "Die Schildkröte hat die programmierte " +
                    "Zeichnung erstellt. Wenn du sie behalten " +
                    "möchtest, kannst du einen Screenshot machen.";
            }
        });
        syncMainPrinterStore();
    }


    function getBwinfCategoryColour(category) {
        var colours = bwinfBlocklyColours.categories;

        if (
            category &&
            Object.prototype.hasOwnProperty.call(
                colours,
                category
            )
        ) {
            return colours[category];
        }

        /*
         * Codecast nennt die Blockly-Prozeduren in der Toolbox
         * functions. Die bisherige Printer-Lib verwendet dafür
         * ihre Standardfarbe.
         */
        if (
            category === "functions" ||
            category === "procedures"
        ) {
            return colours._default;
        }

        return null;
    }


    function getBlocklyCssColour(colour, Blockly) {
        if (typeof colour !== "number") {
            return colour;
        }

        if (
            Blockly &&
            typeof Blockly.hueToRgb === "function"
        ) {
            return Blockly.hueToRgb(colour);
        }

        if (
            Blockly &&
            Blockly.utils &&
            Blockly.utils.colour &&
            typeof Blockly.utils.colour.hueToHex ===
            "function"
        ) {
            return Blockly.utils.colour.hueToHex(colour);
        }

        /*
         * Ohne öffentliche Konvertierungsfunktion die vorhandene
         * Toolbox-Farbe beibehalten. Die Blockfarbe selbst wird von
         * Blockly weiterhin korrekt aus dem Farbton berechnet.
         */
        return "";
    }


    function getBlockCategory(context, blockType) {
        var helper =
            context && context.blocklyHelper
                ? context.blocklyHelper
                : null;

        var availableBlocks =
            helper && Array.isArray(helper.availableBlocks)
                ? helper.availableBlocks
                : [];

        var i;
        var block;

        for (i = 0; i < availableBlocks.length; i++) {
            block = availableBlocks[i];

            if (
                block &&
                block.name === blockType &&
                block.category
            ) {
                return block.category;
            }
        }

        /*
         * Schatten- und dynamische Blöcke stehen nicht immer in
         * availableBlocks. Für sie reichen die stabilen Blockly-
         * Typpräfixe.
         */
        if (
            blockType === "controls_if" ||
            blockType.indexOf("logic_") === 0
        ) {
            return "logic";
        }

        if (blockType.indexOf("controls_") === 0) {
            return "loops";
        }

        if (blockType.indexOf("math_") === 0) {
            return "math";
        }

        if (blockType.indexOf("text_") === 0 ||
            blockType === "text") {
            return "texts";
        }

        if (
            blockType.indexOf("lists_") === 0 ||
            blockType.indexOf("list_") === 0
        ) {
            return "lists";
        }

        if (blockType.indexOf("colour_") === 0) {
            return "colour";
        }

        if (blockType.indexOf("variables_") === 0) {
            return "variables";
        }

        if (blockType.indexOf("procedures_") === 0) {
            return "functions";
        }

        return null;
    }


    function setBwinfBlocklyDefinitionColours(Blockly) {
        var definitions = {
            logic: "logic",
            loops: "loops",
            math: "math",
            texts: "texts",
            lists: "lists",
            colour: "colour",
            variables: "variables",
            procedures: "_default"
        };

        Object.keys(definitions).forEach(
            function (definitionName) {
                var definition =
                    Blockly.Blocks &&
                    Blockly.Blocks[definitionName];

                if (definition) {
                    definition.HUE =
                        bwinfBlocklyColours.categories[
                        definitions[definitionName]
                        ];
                }
            }
        );
    }


    function recolourExistingBlocklyBlocks(context, Blockly) {
        var workspaces = [];
        var workspace;
        var workspaceDatabase;
        var workspaceIds;

        if (
            Blockly.Workspace &&
            typeof Blockly.Workspace.getAll === "function"
        ) {
            workspaces = Blockly.Workspace.getAll();
        } else if (
            Blockly.Workspace &&
            Blockly.Workspace.WorkspaceDB_
        ) {
            /*
             * Die bei Codecast 7.7 verwendete Blockly-Version hat
             * kein Workspace.getAll(). In WorkspaceDB_ stehen aber
             * sowohl der Arbeitsbereich als auch das Bausteinlager.
             */
            workspaceDatabase =
                Blockly.Workspace.WorkspaceDB_;

            workspaceIds = Object.keys(
                workspaceDatabase
            );

            workspaceIds.forEach(function (workspaceId) {
                if (workspaceDatabase[workspaceId]) {
                    workspaces.push(
                        workspaceDatabase[workspaceId]
                    );
                }
            });
        }

        /*
         * Den Hauptarbeitsbereich sicherheitshalber ergänzen,
         * falls er nicht in der Registry enthalten war.
         */
        workspace = getWorkspace();

        if (
            workspace &&
            workspaces.indexOf(workspace) === -1
        ) {
            workspaces.push(workspace);
        }

        workspaces.forEach(function (currentWorkspace) {
            var blocks;

            if (
                !currentWorkspace ||
                typeof currentWorkspace.getAllBlocks !==
                "function"
            ) {
                return;
            }

            blocks = currentWorkspace.getAllBlocks(false);

            blocks.forEach(function (block) {
                var category;
                var colour;

                if (
                    !block ||
                    typeof block.setColour !== "function"
                ) {
                    return;
                }

                category = getBlockCategory(
                    context,
                    block.type || ""
                );

                colour = getBwinfCategoryColour(category);

                if (
                    colour === null ||
                    block.__jwinfBwinfColour === colour
                ) {
                    return;
                }

                block.setColour(colour);
                block.__jwinfBwinfColour = colour;
            });
        });
    }


    function recolourExistingBlocklyToolbox(context) {
        var helper =
            context && context.blocklyHelper
                ? context.blocklyHelper
                : null;

        var categoryStrings =
            helper &&
                helper.strings &&
                helper.strings.categories
                ? helper.strings.categories
                : {};

        var labels = document.querySelectorAll(
            "#react-container .blocklyToolboxDiv " +
            ".blocklyTreeLabel"
        );

        Array.prototype.forEach.call(
            labels,
            function (label) {
                var labelText = label.textContent
                    .replace(/\s+/g, " ")
                    .trim();

                var category;
                var colour;
                var cssColour;
                var row;

                Object.keys(categoryStrings).some(
                    function (categoryName) {
                        if (
                            categoryStrings[categoryName] ===
                            labelText
                        ) {
                            category = categoryName;
                            return true;
                        }

                        return false;
                    }
                );

                colour = getBwinfCategoryColour(category);

                if (colour === null) {
                    return;
                }

                row = label.closest
                    ? label.closest(".blocklyTreeRow")
                    : label.parentElement;

                if (row) {
                    cssColour = getBlocklyCssColour(
                        colour,
                        getBlockly()
                    );

                    if (cssColour) {
                        row.style.borderLeftColor =
                            cssColour;
                    }
                }
            }
        );
    }


    function ensureBwinfBlocklyColours() {
        var context = getMainQuickAlgoContext();
        var Blockly = getBlockly();

        if (
            !context ||
            !Blockly ||
            !isPrinterContext(context) ||
            !usesBwinfBlocklyColourTheme(context)
        ) {
            return;
        }

        if (
            context.__jwinfBwinfColoursPatched !== true
        ) {
            context.__jwinfBwinfColoursPatched = true;

            /*
             * Codecast 7.7 bringt für "bwinf" eine eigene, von der
             * bisherigen Printer-Lib abweichende Farbpalette mit.
             * Die lokale Variante entspricht blocklyPrinter_lib-2.1.
             */
            context.provideBlocklyColours =
                copyBwinfBlocklyColours;
        }

        setBwinfBlocklyDefinitionColours(Blockly);
        recolourExistingBlocklyBlocks(context, Blockly);
        recolourExistingBlocklyToolbox(context);
    }


    function shouldShowExpectedOutput() {
        return (
            getCodecastParameters().showExpectedOutput !==
            false
        );
    }


    function findExpectedOutputCards() {
        var view = document.querySelector(
            "#react-container .input-output-view"
        );

        var cards = [];
        var editors;

        if (!view) {
            return cards;
        }

        /*
         * Je nach Testart verwendet Codecast für das Feld einen
         * normalen Editor oder den bearbeitbaren Test-Ausgabepuffer.
         */
        editors = view.querySelectorAll(
            "[data-cursor-zone='editor:test_output'], " +
            "[data-cursor-zone='editor:printerLibTestOutput']"
        );

        Array.prototype.forEach.call(
            editors,
            function (editor) {
                var card = editor.closest
                    ? editor.closest(".card")
                    : null;

                if (card && cards.indexOf(card) === -1) {
                    cards.push(card);
                }
            }
        );

        if (cards.length > 0) {
            return cards;
        }

        /*
         * Fallback, solange der Ace-Editor noch nicht initialisiert
         * ist. Die Texte decken die von Codecast 7.7 mitgelieferten
         * Sprachen ab.
         */
        Array.prototype.forEach.call(
            view.querySelectorAll(
                ".card > .terminal-view-header"
            ),
            function (header) {
                var text = header.textContent
                    .replace(/\s+/g, " ")
                    .trim()
                    .toLowerCase();

                var expectedLabels = [
                    "erwartete ausgabe",
                    "expected output",
                    "sortie attendue",
                    "verwachte uitvoer"
                ];

                var card;

                if (expectedLabels.indexOf(text) === -1) {
                    return;
                }

                card = header.closest
                    ? header.closest(".card")
                    : header.parentElement;

                if (card && cards.indexOf(card) === -1) {
                    cards.push(card);
                }
            }
        );

        return cards;
    }


    function updateExpectedOutputVisibility() {
        var showExpectedOutput =
            shouldShowExpectedOutput();

        var hiddenCards = document.querySelectorAll(
            "[data-jwinf-expected-output-hidden='true']"
        );

        Array.prototype.forEach.call(
            hiddenCards,
            function (card) {
                if (showExpectedOutput) {
                    card.style.removeProperty("display");
                    delete card.dataset
                        .jwinfExpectedOutputHidden;
                }
            }
        );

        if (showExpectedOutput) {
            return;
        }

        findExpectedOutputCards().forEach(function (card) {
            card.dataset.jwinfExpectedOutputHidden = "true";
            card.style.setProperty(
                "display",
                "none",
                "important"
            );
        });
    }

    /* ---------------------------------------------------------
    * Variablen und Funktionsaufrufe
    * --------------------------------------------------------- */

    function getCodecastRunner() {
        return (
            window.Codecast &&
                window.Codecast.runner
                ? window.Codecast.runner
                : null
        );
    }


    function getRunnerInterpreter(runner) {
        var node;

        if (
            !runner ||
            !runner.interpreters ||
            runner.interpreters.length === 0
        ) {
            return null;
        }

        node =
            runner.context &&
                typeof runner.context.curNode === "number"
                ? runner.context.curNode
                : 0;

        return (
            runner.interpreters[node] ||
            runner.interpreters[0] ||
            null
        );
    }


    function getRunnerScope(runner) {
        var interpreter = getRunnerInterpreter(runner);

        if (
            !interpreter ||
            typeof interpreter.getScope !== "function"
        ) {
            return null;
        }

        try {
            return interpreter.getScope();
        } catch (error) {
            return null;
        }
    }


    function resetJwinfVariableFrames(runner) {
        var interpreter = getRunnerInterpreter(runner);
        var globalVariables = {};

        /*
         * Wird der Adapter erst während eines laufenden Programms
         * installiert, bereits gemeldete globale Werte übernehmen.
         */
        if (
            runner.localVariables &&
            typeof runner.localVariables === "object"
        ) {
            Object.keys(runner.localVariables).forEach(
                function (name) {
                    globalVariables[name] =
                        runner.localVariables[name];
                }
            );
        }

        runner.__jwinfVariableFrames = [
            {
                id: 1,
                name: null,
                args: [],
                variables: globalVariables,
                scope: interpreter
                    ? interpreter.global
                    : null,
                generatedToOriginal: {}
            }
        ];

        runner.__jwinfNextVariableFrameId = 2;
    }


    function ensureJwinfVariableFrames(runner) {
        if (
            !runner.__jwinfVariableFrames ||
            runner.__jwinfVariableFrames.length === 0
        ) {
            resetJwinfVariableFrames(runner);
        }

        return runner.__jwinfVariableFrames;
    }


    function getOriginalVariableName(
        runner,
        generatedName
    ) {
        var frames = ensureJwinfVariableFrames(runner);
        var Blockly = getBlockly();
        var database;
        var databaseName;
        var originalName;
        var variableList;
        var i;

        for (i = frames.length - 1; i >= 0; i--) {
            originalName =
                frames[i]
                    .generatedToOriginal[generatedName];

            if (originalName) {
                return originalName;
            }
        }

        database =
            Blockly &&
                Blockly.JavaScript &&
                Blockly.JavaScript.variableDB_
                ? Blockly.JavaScript.variableDB_.db_
                : null;

        if (database) {
            for (databaseName in database) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        database,
                        databaseName
                    ) &&
                    database[databaseName] === generatedName
                ) {
                    /*
                     * Blockly hängt seinem Datenbankschlüssel den
                     * Variablentyp an. Codecast entfernt dasselbe
                     * neun Zeichen lange Suffix.
                     */
                    originalName = databaseName.substring(
                        0,
                        databaseName.length - 9
                    );

                    variableList =
                        runner.context &&
                            runner.context.blocklyHelper &&
                            runner.context.blocklyHelper.workspace
                            ? runner.context
                                .blocklyHelper
                                .workspace
                                .variableList
                            : [];

                    for (
                        i = 0;
                        i < variableList.length;
                        i++
                    ) {
                        if (
                            originalName.toLowerCase() ===
                            variableList[i].toLowerCase()
                        ) {
                            return variableList[i];
                        }
                    }

                    return originalName;
                }
            }
        }

        return generatedName;
    }


    function findVariableFrame(
        runner,
        generatedName
    ) {
        var frames = ensureJwinfVariableFrames(runner);
        var interpreter = getRunnerInterpreter(runner);
        var scope = getRunnerScope(runner);
        var i;

        if (!interpreter) {
            return frames[frames.length - 1];
        }

        while (
            scope &&
            scope !== interpreter.global
        ) {
            if (
                scope.properties &&
                generatedName in scope.properties
            ) {
                for (
                    i = frames.length - 1;
                    i >= 0;
                    i--
                ) {
                    if (frames[i].scope === scope) {
                        return frames[i];
                    }
                }

                break;
            }

            scope = scope.parentScope;
        }

        /*
         * Variablen, die nicht im aktuellen Funktions-Scope liegen,
         * gehören in den globalen Frame.
         */
        return frames[0];
    }


    function flattenJwinfVariableFrames(runner) {
        var variables = {};

        ensureJwinfVariableFrames(runner).forEach(
            function (frame) {
                Object.keys(frame.variables).forEach(
                    function (name) {
                        variables[name] =
                            frame.variables[name];
                    }
                );
            }
        );

        return variables;
    }


    function ensureVariableManagerRunnerPatch() {
        var runner = getCodecastRunner();
        var originalReportBlockValue;
        var originalFetchLatestBlocklyAnalysis;
        var originalInitCodes;

        if (
            !runner ||
            typeof runner.reportBlockValue !== "function" ||
            typeof runner.fetchLatestBlocklyAnalysis !==
            "function"
        ) {
            return null;
        }

        /*
         * Falls eine spätere Codecast-Version die Funktion nativ
         * unterstützt, wird dieser Adapter nicht angewendet.
         */
        if (
            typeof runner.reportFunctionCall === "function" &&
            typeof runner.getVariableFrames === "function"
        ) {
            return runner;
        }

        if (runner.__jwinfVariableManagerPatched) {
            return runner;
        }

        runner.__jwinfVariableManagerPatched = true;

        originalReportBlockValue =
            runner.reportBlockValue;

        originalFetchLatestBlocklyAnalysis =
            runner.fetchLatestBlocklyAnalysis;

        originalInitCodes = runner.initCodes;

        runner.reportBlockValue = function (
            id,
            value,
            variableName
        ) {
            var result =
                originalReportBlockValue.apply(
                    this,
                    arguments
                );

            var generatedName;
            var originalName;
            var frame;

            if (
                !this.context ||
                this.context.display === false ||
                !variableName ||
                variableName === "@@LOOP_ITERATION@@"
            ) {
                return result;
            }

            generatedName = variableName.toString();

            originalName = getOriginalVariableName(
                this,
                generatedName
            );

            frame = findVariableFrame(
                this,
                generatedName
            );

            frame.generatedToOriginal[generatedName] =
                originalName;

            frame.variables[originalName] = value;

            return result;
        };

        runner.getLocalVariables = function () {
            return flattenJwinfVariableFrames(this);
        };

        runner.fetchLatestBlocklyAnalysis = function (
            localVariables,
            lastAnalysis,
            newStepNum
        ) {
            var frames =
                ensureJwinfVariableFrames(this);

            var stackFrames = [];

            var baseAnalysis =
                lastAnalysis || {
                    stackFrames: [],
                    code: this._code,
                    stepNum: 0
                };

            frames.forEach(function (frame) {
                var frameAnalysis =
                    originalFetchLatestBlocklyAnalysis.call(
                        runner,
                        frame.variables,
                        baseAnalysis,
                        newStepNum
                    );

                var stackFrame =
                    frameAnalysis &&
                        frameAnalysis.stackFrames
                        ? frameAnalysis.stackFrames[0]
                        : null;

                if (!stackFrame) {
                    return;
                }

                stackFrame.id = frame.id;
                stackFrame.name = frame.name;
                stackFrame.args = frame.args.slice();

                stackFrames.push(stackFrame);
            });

            return Object.assign(
                {},
                baseAnalysis,
                {
                    stackFrames: stackFrames,
                    stepNum: newStepNum
                }
            );
        };

        if (typeof originalInitCodes === "function") {
            runner.initCodes = function () {
                var result =
                    originalInitCodes.apply(
                        this,
                        arguments
                    );

                resetJwinfVariableFrames(this);

                return result;
            };
        }

        resetJwinfVariableFrames(runner);

        return runner;
    }


    function enterFunction(functionName) {
        var runner =
            ensureVariableManagerRunnerPatch();

        var frames;
        var parameters;
        var variables = {};
        var args = [];
        var generatedToOriginal = {};
        var i;
        var originalName;
        var generatedName;

        if (
            !runner ||
            !runner.context ||
            runner.context.display === false
        ) {
            return;
        }

        frames = ensureJwinfVariableFrames(runner);

        parameters =
            Array.prototype.slice.call(
                arguments,
                1
            );

        for (
            i = 0;
            i + 2 < parameters.length;
            i += 3
        ) {
            originalName = parameters[i].toString();

            generatedName =
                parameters[i + 1].toString();

            args.push(originalName);

            variables[originalName] =
                parameters[i + 2];

            generatedToOriginal[generatedName] =
                originalName;
        }

        frames.push({
            id: runner.__jwinfNextVariableFrameId++,
            name: functionName.toString(),
            args: args,
            variables: variables,
            scope: getRunnerScope(runner),
            generatedToOriginal:
                generatedToOriginal
        });
    }


    function leaveFunction() {
        var runner =
            ensureVariableManagerRunnerPatch();

        var frames;
        var scope;
        var i;

        if (
            !runner ||
            !runner.context ||
            runner.context.display === false
        ) {
            return;
        }

        frames = ensureJwinfVariableFrames(runner);

        if (frames.length <= 1) {
            return;
        }

        scope = getRunnerScope(runner);

        for (
            i = frames.length - 1;
            i > 0;
            i--
        ) {
            if (frames[i].scope === scope) {
                frames.splice(i);
                return;
            }
        }

        /*
         * Falls der Interpreter den Scope im finally-Block nicht
         * mehr liefert, nur den obersten Frame entfernen.
         */
        frames.pop();
    }


    window.jwinfCodecastVariableManager = {
        enterFunction: enterFunction,
        leaveFunction: leaveFunction,
        ensureRunnerPatch:
            ensureVariableManagerRunnerPatch
    };

    function isBlocklyGroupedByCategory(injectionDiv) {
        var parameters =
            window.taskData &&
                window.taskData.codecastParameters
                ? window.taskData.codecastParameters
                : {};

        var groupByCategory = parameters.groupByCategory;
        var level;

        /*
         * Bei einer nach Kategorien gruppierten Toolbox übernimmt
         * Blockly selbst die Navigation. Der zusätzliche Einklapppfeil
         * ist dort nicht sinnvoll.
         *
         * Falls beim Levelwechsel noch ein eingeklappter Zustand aktiv
         * ist, wird dieser ebenfalls wieder aufgehoben.
         */
        if (
            injectionDiv &&
            injectionDiv.querySelector(
                ".blocklyToolboxDiv, .blocklyTreeRoot"
            )
        ) {
            return true;
        }

        if (groupByCategory === true) {
            return true;
        }

        if (
            !groupByCategory ||
            typeof groupByCategory !== "object"
        ) {
            return false;
        }

        level = getCurrentTaskLevel();

        return (
            typeof level === "string" &&
            groupByCategory[level] === true
        );
    }

    /* ---------------------------------------------------------
     * Blockly-Zugriff
     * --------------------------------------------------------- */

    function getBlockly() {
        return window.Blockly || null;
    }


    function getWorkspace() {
        var Blockly = getBlockly();
        var workspace;
        var workspaces;
        var i;

        if (!Blockly) {
            return null;
        }

        /*
         * Je nach Blockly-Version existiert eine dieser Varianten.
         */
        if (typeof Blockly.getMainWorkspace === "function") {
            workspace = Blockly.getMainWorkspace();

            if (workspace) {
                return workspace;
            }
        }

        if (Blockly.mainWorkspace) {
            return Blockly.mainWorkspace;
        }

        if (
            Blockly.Workspace &&
            typeof Blockly.Workspace.getAll === "function"
        ) {
            workspaces = Blockly.Workspace.getAll();

            for (i = 0; i < workspaces.length; i++) {
                if (
                    workspaces[i] &&
                    workspaces[i].isFlyout !== true
                ) {
                    return workspaces[i];
                }
            }
        }

        if (Blockly.clipboardSource_) {
            return Blockly.clipboardSource_;
        }

        return null;
    }


    function getSelectedBlock(workspace) {
        var Blockly = getBlockly();
        var selected = null;

        if (!Blockly) {
            return null;
        }

        /*
         * Von der in Codecast verwendeten Blockly-Version genutzt.
         */
        if (Blockly.selected) {
            selected = Blockly.selected;
        } else if (typeof Blockly.getSelected === "function") {
            selected = Blockly.getSelected();
        }

        /*
         * Keine Auswahl aus einem inzwischen entfernten Workspace
         * übernehmen.
         */
        if (
            selected &&
            selected.workspace &&
            selected.workspace !== workspace
        ) {
            return null;
        }

        return selected;
    }


    /*
     * Sucht das eigentliche Programm unterhalb des Startbausteins.
     * Das entspricht dem bisherigen QuickAlgo-Verhalten.
     */
    function getMainProgramBlock(workspace) {
        if (
            !workspace ||
            typeof workspace.getTopBlocks !== "function"
        ) {
            return null;
        }

        var blocks = workspace.getTopBlocks(false);
        var i;
        var block;
        var nextBlock;

        /*
         * Zuerst nach robot_start suchen.
         */
        for (i = 0; i < blocks.length; i++) {
            block = blocks[i];

            if (block.type !== "robot_start") {
                continue;
            }

            if (typeof block.getNextBlock === "function") {
                nextBlock = block.getNextBlock();

                if (nextBlock) {
                    return nextBlock;
                }
            }

            /*
             * In der bisherigen Blockly-Version befindet sich das
             * Programm häufig als erstes Kind unter robot_start.
             */
            if (
                block.childBlocks_ &&
                block.childBlocks_.length > 0
            ) {
                return block.childBlocks_[0];
            }
        }

        /*
         * Aufgaben ohne robot_start:
         * ersten normalen, obersten Baustein verwenden.
         */
        for (i = 0; i < blocks.length; i++) {
            if (blocks[i].type !== "robot_start") {
                return blocks[i];
            }
        }

        return null;
    }


    function removeBlockIds(node) {
        var i;

        if (!node) {
            return;
        }

        if (
            node.nodeType === 1 &&
            typeof node.removeAttribute === "function"
        ) {
            node.removeAttribute("id");
        }

        if (!node.childNodes) {
            return;
        }

        for (i = 0; i < node.childNodes.length; i++) {
            removeBlockIds(node.childNodes[i]);
        }
    }


    /* ---------------------------------------------------------
     * Kopieren und Einfügen
     * --------------------------------------------------------- */

    function copyBlocks() {
        var Blockly = getBlockly();
        var workspace = getWorkspace();

        if (!Blockly || !workspace) {
            showMessage(
                "Der Blockly-Arbeitsbereich ist noch nicht verfügbar.",
                true
            );
            return;
        }

        var block = getSelectedBlock(workspace);

        /*
         * Den unveränderlichen Startbaustein nicht selbst kopieren.
         */
        if (block && block.type === "robot_start") {
            block = getMainProgramBlock(workspace);
        }

        /*
         * Ohne Auswahl wie bisher das gesamte Programm unterhalb
         * des Startbausteins kopieren.
         */
        if (!block) {
            block = getMainProgramBlock(workspace);
        }

        if (!block) {
            showMessage(
                "Es gibt noch keine Bausteine zum Kopieren.",
                true
            );
            return;
        }

        try {
            /*
             * Diese Funktion verwendet auch die bisherige
             * QuickAlgo-Implementierung.
             */
            if (typeof Blockly.copy_ === "function") {
                Blockly.copy_(block);
            } else if (
                Blockly.Xml &&
                typeof Blockly.Xml.blockToDom === "function"
            ) {
                /*
                 * Fallback für eine eventuell spätere Blockly-Version.
                 */
                var xml = Blockly.Xml.blockToDom(block);

                removeBlockIds(xml);

                Blockly.clipboardXml_ = xml;
                Blockly.clipboardSource_ = workspace;
            } else {
                throw new Error(
                    "Keine passende Blockly-Kopierfunktion gefunden."
                );
            }

            showMessage("Bausteine kopiert.");
        } catch (error) {
            console.error(
                "JwInf Codecast: Kopieren fehlgeschlagen.",
                error
            );

            showMessage(
                "Die Bausteine konnten nicht kopiert werden.",
                true
            );
        }
    }


    function pasteBlocks() {
        var Blockly = getBlockly();
        var workspace = getWorkspace();

        if (!Blockly || !workspace) {
            showMessage(
                "Der Blockly-Arbeitsbereich ist noch nicht verfügbar.",
                true
            );
            return;
        }

        /*
         * Codecast verwendet false, wenn kopierte Bausteine in der
         * aktuellen Aufgabe nicht erlaubt sind.
         */
        if (Blockly.clipboardXml_ === false) {
            showMessage(
                "Die kopierten Bausteine sind in dieser Aufgabe nicht erlaubt.",
                true
            );
            return;
        }

        if (!Blockly.clipboardXml_) {
            showMessage(
                "Es wurden noch keine Bausteine kopiert.",
                true
            );
            return;
        }

        try {
            var xml = Blockly.clipboardXml_.cloneNode(true);

            /*
             * Native Blockly-Einfügefunktion. Sie kümmert sich unter
             * anderem um Positionierung und Undo-Ereignisse.
             */
            if (typeof workspace.paste === "function") {
                workspace.paste(xml);
            } else if (
                Blockly.Xml &&
                typeof Blockly.Xml.domToWorkspace === "function" &&
                typeof Blockly.Xml.domToText === "function" &&
                typeof Blockly.Xml.textToDom === "function"
            ) {
                /*
                 * Fallback, falls workspace.paste in einer späteren
                 * Version nicht mehr vorhanden ist.
                 */
                var xmlText = Blockly.Xml.domToText(xml);
                var wrapper = Blockly.Xml.textToDom(
                    "<xml>" + xmlText + "</xml>"
                );

                Blockly.Xml.domToWorkspace(wrapper, workspace);
            } else {
                throw new Error(
                    "Keine passende Blockly-Einfügefunktion gefunden."
                );
            }

            showMessage("Bausteine eingefügt.");
        } catch (error) {
            console.error(
                "JwInf Codecast: Einfügen fehlgeschlagen.",
                error
            );

            showMessage(
                "Die Bausteine konnten nicht eingefügt werden.",
                true
            );
        }
    }


    /* ---------------------------------------------------------
     * Rückgängig und  Wiederherstellen
     * --------------------------------------------------------- */

    function changeHistory(redo) {
        var workspace = getWorkspace();

        if (
            !workspace ||
            typeof workspace.undo !== "function"
        ) {
            showMessage(
                "Diese Aktion ist derzeit nicht verfügbar.",
                true
            );
            return;
        }

        var stack = redo
            ? workspace.redoStack_
            : workspace.undoStack_;

        /*
         * Die internen Stacks sind in der verwendeten Blockly-Version
         * vorhanden. Falls eine andere Version sie nicht öffentlich
         * bereitstellt, versuchen wir die Aktion trotzdem.
         */
        if (stack && stack.length === 0) {
            showMessage(
                redo
                    ? "Es gibt nichts wiederherzustellen."
                    : "Es gibt nichts rückgängig zu machen.",
                true
            );
            return;
        }

        try {
            /*
             * false = rückgängig
             * true  = wieder her stellen
             */
            workspace.undo(redo);
        } catch (error) {
            console.error(
                "JwInf Codecast: Änderung des Verlaufs fehlgeschlagen.",
                error
            );

            showMessage(
                "Die Aktion konnte nicht ausgeführt werden.",
                true
            );
        }
    }


    function undo() {
        changeHistory(false);
    }


    function redo() {
        changeHistory(true);
    }


    /* ---------------------------------------------------------
     * Codecast-Menü
     * --------------------------------------------------------- */

    function closeCodecastMenu() {
        /*
         * Codecast schließt das Menü, wenn außerhalb des
         * Menü-Containers ein mousedown-Ereignis auftritt.
         */
        window.setTimeout(function () {
            var event;

            if (typeof window.MouseEvent === "function") {
                event = new window.MouseEvent("mousedown", {
                    bubbles: true,
                    cancelable: true
                });
            } else {
                event = document.createEvent("MouseEvents");
                event.initMouseEvent(
                    "mousedown",
                    true,
                    true,
                    window,
                    1,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null
                );
            }

            document.body.dispatchEvent(event);
        }, 0);
    }


    function runAction(action) {
        var result = null;

        if (action === "copy") {
            copyBlocks();
        } else if (action === "paste") {
            pasteBlocks();
        } else if (action === "undo") {
            undo();
        } else if (action === "redo") {
            redo();
        } else if (action === "export-program-svg") {
            result = exportProgramAsSvg();
        } else if (action === "export-grid-svg") {
            result = exportGridAsSvg();
        }

        if (
            result &&
            typeof result.catch === "function"
        ) {
            result.catch(function (error) {
                console.error(
                    "JwInf Codecast: SVG-Export fehlgeschlagen.",
                    error
                );

                showMessage(
                    "Das SVG konnte nicht erstellt werden.",
                    true
                );
            });
        }

        closeCodecastMenu();
    }


    function getIcon(action) {
        var start =
            '<svg class="jwinf-codecast-menu-icon" ' +
            'viewBox="0 0 24 24" aria-hidden="true" ' +
            'focusable="false">';

        var end = "</svg>";

        if (action === "copy") {
            return (
                start +
                '<rect x="9" y="9" width="10" height="10" rx="2"></rect>' +
                '<path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"></path>' +
                end
            );
        }

        if (action === "paste") {
            return (
                start +
                '<path d="M9 5h6"></path>' +
                '<path d="M9 3h6a2 2 0 0 1 2 2v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V5a2 2 0 0 1 2-2"></path>' +
                end
            );
        }

        if (action === "undo") {
            return (
                start +
                '<path d="M9 7 4 12l5 5"></path>' +
                '<path d="M5 12h9a6 6 0 0 1 6 6"></path>' +
                end
            );
        }

        if (action === "export-program-svg") {
            return (
                start +
                '<path d="M12 3v11"></path>' +
                '<path d="m7 10 5 5 5-5"></path>' +
                '<path d="M5 19h14"></path>' +
                '<rect x="4" y="4" width="16" height="3" rx="1"></rect>' +
                end
            );
        }

        if (action === "export-grid-svg") {
            return (
                start +
                '<rect x="4" y="4" width="16" height="16" rx="2"></rect>' +
                '<path d="M4 10h16"></path>' +
                '<path d="M10 4v16"></path>' +
                end
            );
        }

        return (
            start +
            '<path d="m15 7 5 5-5 5"></path>' +
            '<path d="M19 12h-9a6 6 0 0 0-6 6"></path>' +
            end
        );
    }


    function createMenuItem(action, label) {
        var item = document.createElement("div");

        item.id = "jwinf-codecast-menu-" + action;
        item.className =
            "menu-item jwinf-codecast-menu-item";
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute("data-jwinf-action", action);

        item.innerHTML =
            getIcon(action) +
            "<span>" + label + "</span>";

        item.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            runAction(action);
        });

        item.addEventListener("keydown", function (event) {
            var isEnter =
                event.key === "Enter" ||
                event.keyCode === 13;

            var isSpace =
                event.key === " " ||
                event.key === "Spacebar" ||
                event.keyCode === 32;

            if (!isEnter && !isSpace) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            runAction(action);
        });

        return item;
    }

    /* ---------------------------------------------------------
    * Reihenfolge der vorhandenen Codecast-Menüpunkte
    * --------------------------------------------------------- */

    function findAboutMenuItem(menu) {
        /*
        * Bevorzugt über das Help-Icon suchen, damit die Funktion
        * nicht allein von der aktuell verwendeten Sprache abhängt.
        */
        var icon = menu.querySelector(
            ".bp6-icon-help, svg[data-icon='help']"
        );

        if (icon && typeof icon.closest === "function") {
            var iconItem = icon.closest(".menu-item");

            if (iconItem && iconItem.parentNode === menu) {
                return iconItem;
            }
        }

        /*
        * Fallback für den Fall, dass sich die Icon-Klassen ändern.
        */
        var items = menu.children;
        var i;
        var span;
        var label;

        for (i = 0; i < items.length; i++) {
            if (!items[i].classList.contains("menu-item")) {
                continue;
            }

            span = items[i].querySelector("span");

            if (!span) {
                continue;
            }

            label = span.textContent
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

            if (
                label === "über codecast" ||
                label === "über"
            ) {
                return items[i];
            }
        }

        return null;
    }

    function resizeBlocklyWorkspace() {
        var Blockly = getBlockly();
        var workspace = getWorkspace();

        if (
            Blockly &&
            workspace &&
            typeof Blockly.svgResize === "function"
        ) {
            Blockly.svgResize(workspace);
        }
    }


    function resizeBlocklyWorkspaceSoon() {
        resizeBlocklyWorkspace();

        window.setTimeout(resizeBlocklyWorkspace, 80);
        window.setTimeout(resizeBlocklyWorkspace, 250);
    }


    function setBlocklyToolboxVisible(visible) {
        var workspace = getWorkspace();
        var toolbox = null;

        if (!workspace) {
            return false;
        }

        if (typeof workspace.getToolbox === "function") {
            toolbox = workspace.getToolbox();
        } else if (workspace.toolbox_) {
            toolbox = workspace.toolbox_;
        }

        if (
            toolbox &&
            typeof toolbox.setVisible === "function"
        ) {
            toolbox.setVisible(visible);
            resizeBlocklyWorkspace();

            return true;
        }

        return false;
    }


    function getBlocklyToolboxElements() {
        var root = document.querySelector(
            "#react-container .platform-blockly"
        );

        var injectionDiv = document.querySelector(
            "#react-container .platform-blockly .injectionDiv"
        );

        var flyout = injectionDiv
            ? injectionDiv.querySelector(".blocklyFlyout")
            : null;

        var flyoutBackground = flyout
            ? flyout.querySelector(".blocklyFlyoutBackground")
            : null;

        return {
            root: root,
            injectionDiv: injectionDiv,
            flyout: flyout,
            flyoutBackground: flyoutBackground
        };
    }


    function getBlocklyFlyoutWidth(elements) {
        var width = 0;
        var rect;
        var bbox;
        var match;
        var d;

        if (!elements || !elements.root) {
            return 220;
        }

        /*
         * Normalfall: sichtbare Flyout-Gruppe messen.
         */
        if (elements.flyout) {
            rect = elements.flyout.getBoundingClientRect();

            if (
                rect &&
                isFinite(rect.width) &&
                rect.width > 0
            ) {
                width = rect.width;
            }
        }

        /*
         * Fallback: Hintergrund-Pfad der Flyout-Leiste messen.
         */
        if (
            (!width || width <= 0) &&
            elements.flyoutBackground &&
            typeof elements.flyoutBackground.getBBox === "function"
        ) {
            try {
                bbox = elements.flyoutBackground.getBBox();

                if (
                    bbox &&
                    isFinite(bbox.width) &&
                    bbox.width > 0
                ) {
                    width = bbox.x + bbox.width;
                }
            } catch (_) {
                width = 0;
            }
        }

        /*
         * Weiterer Fallback: Breite aus dem Pfad lesen.
         */
        if (
            (!width || width <= 0) &&
            elements.flyoutBackground
        ) {
            d = elements.flyoutBackground.getAttribute("d");

            if (d) {
                match = d.match(/h\s*([0-9.]+)/i);

                if (match) {
                    width = parseFloat(match[1]) + 8;
                }
            }
        }

        /*
         * Wenn die Leiste eingeklappt ist, kann sie nicht gemessen
         * werden. Dann nehmen wir die zuletzt gemessene Breite.
         */
        if (
            (!width || width <= 0) &&
            elements.root.dataset.jwinfBlocklyFlyoutWidth
        ) {
            width = parseFloat(
                elements.root.dataset.jwinfBlocklyFlyoutWidth
            );
        }

        /*
         * Letzter Fallback.
         */
        if (!width || !isFinite(width) || width <= 0) {
            width = 220;
        }

        elements.root.dataset.jwinfBlocklyFlyoutWidth =
            String(width);

        return width;
    }


    function positionBlocklyToolboxCollapser(button) {
        var elements = getBlocklyToolboxElements();
        var root = elements.root;
        var injectionDiv = elements.injectionDiv;
        var flyout = elements.flyout;
        var left = 0;
        var flyoutRect;
        var injectionRect;

        if (!root || !injectionDiv || !button) {
            return;
        }

        if (
            root.classList.contains(
                "jwinf-blockly-toolbox-collapsed"
            )
        ) {
            button.style.left = "0px";
            return;
        }

        /*
         * Wenn möglich: echte rechte Kante der Flyout-Leiste.
         */
        if (flyout) {
            flyoutRect = flyout.getBoundingClientRect();
            injectionRect = injectionDiv.getBoundingClientRect();

            if (
                flyoutRect &&
                injectionRect &&
                isFinite(flyoutRect.right) &&
                isFinite(injectionRect.left) &&
                flyoutRect.right > injectionRect.left
            ) {
                left = flyoutRect.right - injectionRect.left;
            }
        }

        /*
         * Falls die echte Position noch nicht messbar ist,
         * über die Flyout-Breite gehen.
         */
        if (!left || !isFinite(left) || left <= 0) {
            left = getBlocklyFlyoutWidth(elements);
        }

        button.style.left = Math.round(left) + "px";
    }


    function getBlocklyCollapserIcon() {
        return (
            '<svg data-prefix="fas" data-icon="chevron-left" ' +
            'class="svg-inline--fa fa-chevron-left" role="img" ' +
            'viewBox="0 0 320 512" aria-hidden="true">' +
            '<path fill="currentColor" d="' +
            'M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3' +
            'l192 192c12.5 12.5 32.8 12.5 45.3 0' +
            's12.5-32.8 0-45.3L77.3 256 246.6 86.6' +
            'c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5' +
            '-45.3 0l-192 192z' +
            '"></path></svg>'
        );
    }


    function ensureBlocklyResizeHandler() {
        if (blocklyResizeHandlerInstalled) {
            return;
        }

        blocklyResizeHandlerInstalled = true;

        /*
         * Der Handler sucht bei jedem Resize den aktuell von React
         * gerenderten Button. Dadurch bleibt genau ein globaler
         * Listener aktiv, auch wenn React die Blockly-Ansicht ersetzt.
         */
        window.addEventListener("resize", function () {
            var button = document.querySelector(
                "#react-container " +
                ".jwinf-blockly-toolbox-collapser"
            );

            if (button) {
                positionBlocklyToolboxCollapser(button);
            }
        });
    }

    function syncMainPrinterStore() {
        var environment =
            window.Codecast &&
                window.Codecast.environments
                ? window.Codecast.environments.main
                : null;

        var store = environment && environment.store;
        var state;
        var taskStrings;
        var taskCode;
        var taskMessages;
        var nextStrings;
        var nextIncludeBlocks;
        var stringsChanged;

        if (
            !store ||
            typeof store.getState !== "function" ||
            typeof store.dispatch !== "function"
        ) {
            return;
        }

        try {
            state = store.getState();
        } catch (_) {
            return;
        }

        taskStrings =
            state &&
                state.task &&
                state.task.contextStrings
                ? state.task.contextStrings
                : null;

        taskCode =
            taskStrings && taskStrings.code
                ? taskStrings.code
                : null;

        if (
            !taskCode ||
            (
                !Object.prototype.hasOwnProperty.call(
                    taskCode,
                    "print"
                ) &&
                !Object.prototype.hasOwnProperty.call(
                    taskCode,
                    "read"
                )
            )
        ) {
            return;
        }

        taskMessages = taskStrings.messages || {};

        stringsChanged =
            taskCode.print !== "print" ||
            taskCode.print_end !== "print_end" ||
            taskCode.read !== "input" ||
            taskMessages.inputPrompt !==
            "Bitte gib eine Eingabezeile für das Programm ein." ||
            taskMessages.inputEmpty !==
            (
                "Dein Programm hat versucht, eine Eingabezeile " +
                "zu lesen, obwohl keine Eingabe mehr vorhanden ist!"
            );

        if (stringsChanged) {
            nextStrings = Object.assign(
                {},
                taskStrings,
                {
                    code: Object.assign(
                        {},
                        taskCode,
                        {
                            print: "print",
                            print_end: "print_end",
                            read: "input"
                        }
                    ),

                    messages: Object.assign(
                        {},
                        taskMessages,
                        {
                            inputPrompt:
                                "Bitte gib eine Eingabezeile " +
                                "für das Programm ein.",

                            inputEmpty:
                                "Dein Programm hat versucht, " +
                                "eine Eingabezeile zu lesen, " +
                                "obwohl keine Eingabe mehr " +
                                "vorhanden ist!"
                        }
                    )
                }
            );

            store.dispatch({
                type: "task/taskSetContextStrings",
                payload: nextStrings
            });
        }

        if (!isPythonPlatform()) {
            return;
        }
        nextIncludeBlocks =
            copyIncludeBlocksWithLegacyPrinterNames(
                state && state.task
                    ? state.task.contextIncludeBlocks
                    : null
            );

        if (nextIncludeBlocks) {
            store.dispatch({
                type: "task/taskSetContextIncludeBlocks",
                payload: nextIncludeBlocks
            });
        }
    }

    function enhanceBlocklyToolboxCollapser() {
        var elements = getBlocklyToolboxElements();
        var root = elements.root;
        var injectionDiv = elements.injectionDiv;
        var existingButton;
        var hadCustomState;

        if (!root || !injectionDiv) {
            return;
        }

        ensureBlocklyResizeHandler();

        existingButton = injectionDiv.querySelector(
            ".jwinf-blockly-toolbox-collapser"
        );

        /*
         * Bei einer nach Kategorien gruppierten Toolbox übernimmt
         * Blockly selbst die Navigation. Der zusätzliche Einklapppfeil
         * ist dort nicht sinnvoll.
         *
         * Falls beim Levelwechsel noch ein eingeklappter Zustand aktiv
         * ist, wird dieser ebenfalls wieder aufgehoben.
         */
        if (isBlocklyGroupedByCategory(injectionDiv)) {
            hadCustomState = Boolean(
                existingButton ||
                injectionDiv.classList.contains(
                    "jwinf-blockly-toolbox-wrapper"
                ) ||
                root.classList.contains(
                    "jwinf-blockly-toolbox-collapsed"
                )
            );

            if (existingButton) {
                existingButton.remove();
            }

            injectionDiv.classList.remove(
                "jwinf-blockly-toolbox-wrapper"
            );

            root.classList.remove(
                "jwinf-blockly-toolbox-collapsed"
            );

            if (hadCustomState) {
                setBlocklyToolboxVisible(true);
                resizeBlocklyWorkspaceSoon();
            }

            return;
        }

        if (
            existingButton &&
            existingButton.dataset.jwinfBound === "true"
        ) {
            positionBlocklyToolboxCollapser(existingButton);
            return;
        }

        if (existingButton) {
            existingButton.remove();
        }

        injectionDiv.classList.add(
            "jwinf-blockly-toolbox-wrapper"
        );

        var button = document.createElement("button");
        button.type = "button";
        button.className =
            "task-available-blocks-collapser " +
            "jwinf-blockly-toolbox-collapser";
        button.dataset.jwinfBound = "true";
        button.setAttribute("aria-expanded", "true");
        button.setAttribute(
            "aria-label",
            "Bausteinleiste ausblenden"
        );
        button.setAttribute(
            "title",
            "Bausteinleiste ausblenden"
        );
        button.innerHTML = getBlocklyCollapserIcon();

        button.addEventListener(
            "click",
            function (event) {
                var collapsed;

                event.preventDefault();
                event.stopPropagation();

                if (
                    typeof event.stopImmediatePropagation ===
                    "function"
                ) {
                    event.stopImmediatePropagation();
                }

                collapsed = !root.classList.contains(
                    "jwinf-blockly-toolbox-collapsed"
                );

                root.classList.toggle(
                    "jwinf-blockly-toolbox-collapsed",
                    collapsed
                );

                button.classList.toggle(
                    "is-collapsed",
                    collapsed
                );

                button.setAttribute(
                    "aria-expanded",
                    collapsed ? "false" : "true"
                );

                button.setAttribute(
                    "aria-label",
                    collapsed
                        ? "Bausteinleiste einblenden"
                        : "Bausteinleiste ausblenden"
                );

                button.setAttribute(
                    "title",
                    collapsed
                        ? "Bausteinleiste einblenden"
                        : "Bausteinleiste ausblenden"
                );
                setBlocklyToolboxVisible(!collapsed);

                positionBlocklyToolboxCollapser(button);
                resizeBlocklyWorkspaceSoon();

                window.setTimeout(function () {
                    positionBlocklyToolboxCollapser(button);
                }, 80);

                window.setTimeout(function () {
                    positionBlocklyToolboxCollapser(button);
                }, 250);
            },
            true
        );

        /*
         * Den Button zunächst unsichtbar und ohne Animation an seine
         * endgültige Position setzen. Dadurch fliegt er beim Laden
         * nicht vom linken Rand zur Bausteinleiste.
         */
        button.style.visibility = "hidden";
        button.style.transition = "none";

        /*
         * Die Position kann bereits vor dem Einfügen gesetzt werden.
         * So besitzt der Button beim ersten Rendern direkt die
         * richtige Ausgangsposition.
         */
        positionBlocklyToolboxCollapser(button);
        injectionDiv.appendChild(button);

        /*
         * Blockly benötigt beim ersten Laden etwas Zeit, bis die
         * endgültige Breite der Bausteinleiste feststeht.
         */
        window.setTimeout(function () {
            if (!document.documentElement.contains(button)) {
                return;
            }

            positionBlocklyToolboxCollapser(button);
            button.style.visibility = "visible";

            /*
             * Den korrekt positionierten Zustand einmal berechnen lassen,
             * bevor spätere Animationen wieder erlaubt werden.
             */
            button.getBoundingClientRect();

            window.requestAnimationFrame(function () {
                button.style.transition = "";
            });
        }, 150);

    }

    function arrangeNativeMenuItems(menu) {
        var aboutItem = findAboutMenuItem(menu);

        /*
        * appendChild verschiebt ein bereits vorhandenes Element.
        * Nur ausführen, wenn „Über Codecast“ noch nicht ganz unten ist.
        */
        if (
            aboutItem &&
            aboutItem.parentNode === menu &&
            aboutItem !== menu.lastElementChild
        ) {
            menu.appendChild(aboutItem);
        }
    }

    function preparePrinterContext(context) {
        if (
            !context ||
            !context.customBlocks ||
            !context.customBlocks.printer ||
            !context.printer
        ) {
            return;
        }

        ensurePythonicPrinterNames(context);
        localizePrinterMessages(context);
    }


    function ensureQuickAlgoLibraryRegistryPatch() {
        var registry = window.quickAlgoLoadedLibraries;
        var originalAddLibrary;
        var libraries;

        if (
            !registry ||
            typeof registry.addLibrary !== "function"
        ) {
            return;
        }

        if (
            registry.addLibrary
                .__jwinfPrinterContextPatch !== true
        ) {
            originalAddLibrary = registry.addLibrary;

            registry.addLibrary = function (
                library,
                name,
                environment
            ) {
                /*
                 * Wichtig: vor addLibrary patchen.
                 *
                 * Danach kopiert Codecast die Strings und Blocklisten
                 * in den jeweiligen Store. So erhalten auch Test 2,
                 * Test 3 usw. rechtzeitig input() und print().
                 */
                if (name === "printer") {
                    preparePrinterContext(library);
                }

                return originalAddLibrary.apply(
                    this,
                    arguments
                );
            };

            registry.addLibrary
                .__jwinfPrinterContextPatch = true;
        }

        /*
         * Einen eventuell bereits vorhandenen Hauptkontext ebenfalls
         * vorbereiten.
         */
        if (
            typeof registry.getAllLibraries === "function"
        ) {
            try {
                libraries = registry.getAllLibraries();
            } catch (_) {
                libraries = [];
            }

            libraries.forEach(preparePrinterContext);
        }
    }

    function ensureGermanAceMessages() {
        var ace = window.ace;
        var aceRequire;
        var messageModule;
        var messages;

        /*
         * Ace wird möglicherweise erst nach jwinf-codecast.js geladen.
         * In diesem Fall versucht es der MutationObserver später erneut.
         */
        if (
            !ace ||
            ace === localizedAceInstance ||
            !ace.config ||
            typeof ace.config.setMessages !== "function"
        ) {
            return;
        }

        aceRequire =
            typeof ace.require === "function"
                ? ace.require
                : ace.acequire;

        if (typeof aceRequire !== "function") {
            return;
        }

        try {
            messageModule = aceRequire(
                "ace/lib/default_english_messages"
            );
        } catch (error) {
            return;
        }

        if (
            !messageModule ||
            !messageModule.defaultEnglishMessages
        ) {
            return;
        }

        /*
         * Alle vorhandenen Ace-Meldungen beibehalten und nur
         * den sichtbaren Hinweis für gesperrte Felder ersetzen.
         */
        messages = Object.assign(
            {},
            messageModule.defaultEnglishMessages
        );

        messages["editor.tooltip.disable-editing"] =
            "Dieses Feld kann nicht bearbeitet werden.";

        ace.config.setMessages(messages);
        localizedAceInstance = ace;
    }

    function ensureMenuItems() {
        observerScheduled = false;
        ensureQuickAlgoLibraryRegistryPatch();
        ensureGermanAceMessages();
        ensureGermanCodecastMessages();
        updateExpectedOutputVisibility();
        ensureVariableManagerRunnerPatch();
        enhanceTestSelector();
        enhancePythonAvailableBlocks();
        enhanceCodecastDocumentation();

        /*
         * Blockly durchsuchen wir nur nach Änderungen innerhalb der
         * Blockly-Ansicht. Ausgaben, Tests oder die Dokumentation
         * lösen keinen vollständigen Block-Scans aus.
         */
        if (blocklyEnhancementsDirty) {
            blocklyEnhancementsDirty = false;
            ensureBwinfBlocklyColours();
            enhanceBlocklyToolboxCollapser();
            makeRobotStartBlocksMovable();
        }

        if (!usesBlockly()) {
            return;
        }

        var menu = document.querySelector(
            "#react-container .task-menu"
        );

        if (!menu) {
            return;
        }

        var settings = getSettings();

        var definitions = [
            {
                action: "copy",
                label: "Kopieren",
                enabled: settings.copyPaste
            },
            {
                action: "paste",
                label: "Einfügen",
                enabled: settings.copyPaste
            },
            {
                action: "undo",
                label: "Rückgängig",
                enabled: settings.undoRedo
            },
            {
                action: "redo",
                label: "Wiederherstellen",
                enabled: settings.undoRedo
            },
            {
                action: "export-program-svg",
                label: "Programm als SVG",
                enabled: settings.svgExport
            },
            {
                action: "export-grid-svg",
                label: "Spielfeld als SVG",
                enabled: settings.svgExport
            }
        ];

        var fragment = document.createDocumentFragment();
        var added = false;
        var i;
        var definition;
        var existingItem;

        for (i = 0; i < definitions.length; i++) {
            definition = definitions[i];

            existingItem = document.getElementById(
                "jwinf-codecast-menu-" +
                definition.action
            );

            /*
            * Entferne deaktivierte Menüpunkte
            */
            if (!definition.enabled) {
                if (existingItem) {
                    existingItem.remove();
                }

                continue;
            }

            if (existingItem) {
                continue;
            }

            fragment.appendChild(
                createMenuItem(
                    definition.action,
                    definition.label
                )
            );

            added = true;
        }

        if (added) {
            /*
            * Die eigenen Aktionen stehen oben im Menü.
            */
            menu.insertBefore(fragment, menu.firstChild);
        }

        /*
        * Vorhandene Codecast-Menüpunkte anschließend
        * in die gewünschte Reihenfolge bringen.
        */
        arrangeNativeMenuItems(menu);
    }


    function elementTouchesBlockly(
        element,
        includeDescendants
    ) {
        var selector =
            "#blocklyDiv, " +
            ".blockly-editor, " +
            ".injectionDiv";

        if (!element || element.nodeType !== 1) {
            return false;
        }

        if (
            typeof element.matches === "function" &&
            element.matches(selector)
        ) {
            return true;
        }

        if (
            typeof element.closest === "function" &&
            element.closest(selector)
        ) {
            return true;
        }

        return Boolean(
            includeDescendants &&
            typeof element.querySelector === "function" &&
            element.querySelector(selector)
        );
    }


    function mutationsTouchBlockly(mutations) {
        var i;
        var j;
        var mutation;

        if (
            !mutations ||
            typeof mutations.length !== "number"
        ) {
            return false;
        }

        for (i = 0; i < mutations.length; i++) {
            mutation = mutations[i];

            if (
                elementTouchesBlockly(
                    mutation.target,
                    false
                )
            ) {
                return true;
            }

            for (
                j = 0;
                mutation.addedNodes &&
                j < mutation.addedNodes.length;
                j++
            ) {
                if (
                    elementTouchesBlockly(
                        mutation.addedNodes[j],
                        true
                    )
                ) {
                    return true;
                }
            }

            for (
                j = 0;
                mutation.removedNodes &&
                j < mutation.removedNodes.length;
                j++
            ) {
                if (
                    elementTouchesBlockly(
                        mutation.removedNodes[j],
                        true
                    )
                ) {
                    return true;
                }
            }
        }

        return false;
    }


    function scheduleEnsureMenuItems(mutations) {
        if (mutationsTouchBlockly(mutations)) {
            blocklyEnhancementsDirty = true;
        }

        if (observerScheduled) {
            return;
        }

        observerScheduled = true;
        window.setTimeout(ensureMenuItems, 100);
    }


    function initialize() {
        ensureMenuItems();

        /*
         * React kann das Menü bei einem Zustandswechsel neu rendern.
         * Dann werden unsere Einträge automatisch wieder ergänzt.
         */
        var observer = new MutationObserver(
            scheduleEnsureMenuItems
        );

        var observerTarget =
            document.getElementById("react-container") ||
            document.body;

        observer.observe(observerTarget, {
            childList: true,
            subtree: true
        });
    }

    /* ---------------------------------------------------------
 * Rückmeldung
 * --------------------------------------------------------- */

    function showMessage(message, isError) {
        var toast = document.getElementById(
            "jwinf-codecast-toast"
        );

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "jwinf-codecast-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");

            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className =
            "is-visible" + (isError ? " is-error" : "");

        if (toastTimer) {
            window.clearTimeout(toastTimer);
        }

        toastTimer = window.setTimeout(function () {
            toast.className = "";
        }, 2200);
    }

    /* ---------------------------------------------------------
     * SVG-Export
     * --------------------------------------------------------- */

    function sanitizeFilename(name) {
        return (name || "jwinf")
            .replace(/[\\\/:*?"<>|]+/g, "_")
            .replace(/\s+/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_+|_+$/g, "");
    }

    function getBaseFilename() {
        return sanitizeFilename(document.title || "jwinf");
    }

    function downloadTextFile(filename, text, mimeType) {
        var blob = new Blob([text], {
            type: mimeType || "text/plain;charset=utf-8"
        });

        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.setTimeout(function () {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }

    function serializeSvg(svg) {
        var serializer = new XMLSerializer();
        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            serializer.serializeToString(svg)
        );
    }

    function inlineStylesRecursive(sourceNode, targetNode) {
        if (
            !sourceNode ||
            !targetNode ||
            sourceNode.nodeType !== 1 ||
            targetNode.nodeType !== 1
        ) {
            return;
        }

        var computed = window.getComputedStyle(sourceNode);
        var styleText = "";
        var i;

        for (i = 0; i < computed.length; i++) {
            var prop = computed[i];
            styleText +=
                prop + ":" + computed.getPropertyValue(prop) + ";";
        }

        if (styleText) {
            targetNode.setAttribute("style", styleText);
        }

        var sourceChildren = sourceNode.childNodes;
        var targetChildren = targetNode.childNodes;

        for (
            i = 0;
            i < sourceChildren.length && i < targetChildren.length;
            i++
        ) {
            inlineStylesRecursive(
                sourceChildren[i],
                targetChildren[i]
            );
        }
    }

    function cloneWithInlineStyles(sourceNode) {
        var clone = sourceNode.cloneNode(true);
        inlineStylesRecursive(sourceNode, clone);
        return clone;
    }

    function createSvgRoot(width, height, viewBox) {
        var svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute(
            "xmlns:xlink",
            "http://www.w3.org/1999/xlink"
        );
        svg.setAttribute("width", String(width));
        svg.setAttribute("height", String(height));
        svg.setAttribute("viewBox", viewBox);
        svg.setAttribute("version", "1.1");

        return svg;
    }

    function getBlocklyParentSvg(workspace) {
        if (
            workspace &&
            typeof workspace.getParentSvg === "function"
        ) {
            return workspace.getParentSvg();
        }

        return document.querySelector(
            "#react-container .blocklySvg, .blocklySvg"
        );
    }
    async function exportProgramAsSvg() {
        var workspace = getWorkspace();

        if (!workspace) {
            showMessage(
                "Kein Blockly-Arbeitsbereich gefunden.",
                true
            );
            return;
        }

        var parentSvg = getBlocklyParentSvg(workspace);

        var blockCanvas =
            typeof workspace.getCanvas === "function"
                ? workspace.getCanvas()
                : workspace.svgBlockCanvas_ ||
                (
                    parentSvg &&
                    parentSvg.querySelector(
                        ".blocklyBlockCanvas"
                    )
                );

        if (!parentSvg || !blockCanvas) {
            showMessage(
                "Das Programm konnte nicht gefunden werden.",
                true
            );
            return;
        }

        var bbox;

        try {
            /*
             * Größe aller Blöcke im lokalen Koordinatensystem
             * der Blockly-Zeichenfläche.
             */
            bbox = blockCanvas.getBBox();
        } catch (error) {
            console.error(
                "JwInf Codecast: Die Größe des Programms " +
                "konnte nicht ermittelt werden.",
                error
            );

            showMessage(
                "Das Programm konnte nicht als SVG exportiert werden.",
                true
            );
            return;
        }

        if (
            !bbox ||
            !isFinite(bbox.width) ||
            !isFinite(bbox.height) ||
            bbox.width <= 0 ||
            bbox.height <= 0
        ) {
            showMessage(
                "Es gibt noch keine Bausteine zum Exportieren.",
                true
            );
            return;
        }

        /*
         * Etwas großzügiger Abstand, damit Schatten und rechts
         * herausragende Blockly-Elemente nicht abgeschnitten werden.
         */
        var padding = 32;

        var width = Math.ceil(
            bbox.width + 2 * padding
        );

        var height = Math.ceil(
            bbox.height + 2 * padding
        );

        /*
         * Wichtig: Das neue SVG beginnt bei 0/0.
         * Wir verschieben anschließend die Blöcke hinein.
         */
        var exportSvg = createSvgRoot(
            width,
            height,
            "0 0 " + width + " " + height
        );

        exportSvg.setAttribute(
            "overflow",
            "visible"
        );

        exportSvg.style.overflow = "visible";

        /*
         * Filter, Muster und weitere Blockly-Definitionen übernehmen.
         */
        var defs = parentSvg.querySelector("defs");

        if (defs) {
            exportSvg.appendChild(
                defs.cloneNode(true)
            );
        }

        var canvasClone =
            cloneWithInlineStyles(blockCanvas);

        /*
         * Die äußere Blockly-Gruppe enthält die aktuelle Zoom- und
         * Scrollposition des Editors. Diese Transformation darf nicht
         * ins Export-SVG übernommen werden.
         */
        canvasClone.removeAttribute("transform");

        canvasClone.style.removeProperty(
            "transform"
        );

        canvasClone.style.removeProperty(
            "transform-origin"
        );

        canvasClone.style.overflow = "visible";

        /*
         * Das Programm anhand seiner tatsächlichen Bounding Box
         * mit Abstand oben und links positionieren.
         */
        var wrapper = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        wrapper.setAttribute(
            "transform",
            "translate(" +
            (padding - bbox.x) +
            " " +
            (padding - bbox.y) +
            ")"
        );

        wrapper.appendChild(canvasClone);
        exportSvg.appendChild(wrapper);

        await embedImagesInSvg(exportSvg);

        downloadTextFile(
            getBaseFilename() + "-programm.svg",
            serializeSvg(exportSvg),
            "image/svg+xml;charset=utf-8"
        );

        showMessage(
            "Programm als SVG heruntergeladen."
        );
    }



    function blobToDataUrl(blob) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();

            reader.onload = function () {
                resolve(reader.result);
            };

            reader.onerror = function () {
                reject(reader.error);
            };

            reader.readAsDataURL(blob);
        });
    }


    function getSvgImageHref(image) {
        return (
            image.getAttribute("href") ||
            image.getAttribute("xlink:href") ||
            image.getAttributeNS(
                "http://www.w3.org/1999/xlink",
                "href"
            )
        );
    }


    function setSvgImageHref(image, value) {
        image.setAttribute("href", value);

        image.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            value
        );
    }


    async function embedImagesInSvg(svg) {
        var images = Array.prototype.slice.call(
            svg.querySelectorAll("image")
        );

        /*
         * Dieselbe PNG-Datei kommt im Spielfeld oft sehr häufig vor.
         * Deshalb wird jede URL nur einmal geladen.
         */
        var requests = Object.create(null);
        var failedUrls = [];

        function loadImage(href) {
            var url;
            var absoluteUrl;

            try {
                url = new URL(href, document.baseURI);
                absoluteUrl = url.href;
            } catch (_) {
                return Promise.resolve({
                    absoluteUrl: href
                });
            }

            if (!requests[absoluteUrl]) {
                requests[absoluteUrl] = fetch(absoluteUrl, {
                    credentials:
                        url.origin === window.location.origin
                            ? "same-origin"
                            : "omit",

                    cache: "force-cache"
                })
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error(
                                "HTTP " + response.status
                            );
                        }

                        return response.blob();
                    })
                    .then(blobToDataUrl)
                    .then(function (dataUrl) {
                        return {
                            absoluteUrl: absoluteUrl,
                            dataUrl: dataUrl
                        };
                    })
                    .catch(function (error) {
                        return {
                            absoluteUrl: absoluteUrl,
                        };
                    });
            }

            return requests[absoluteUrl];
        }


        await Promise.all(
            images.map(async function (image) {
                var href = getSvgImageHref(image);

                if (
                    !href ||
                    /^(data:|blob:|#)/i.test(href)
                ) {
                    return;
                }

                var result = await loadImage(href);

                if (result.dataUrl) {
                    setSvgImageHref(
                        image,
                        result.dataUrl
                    );

                    return;
                }

                /*
                 * Falls das Einbetten nicht erlaubt ist, bleibt das Bild
                 * als absolute Online-Adresse verlinkt. Deshalb kann das
                 * SVG trotzdem korrekt aussehen.
                 */
                setSvgImageHref(
                    image,
                    result.absoluteUrl || href
                );

                if (
                    failedUrls.indexOf(
                        result.absoluteUrl || href
                    ) === -1
                ) {
                    failedUrls.push(
                        result.absoluteUrl || href
                    );
                }
            })
        );

        /*
         * Nur noch eine Meldung pro Export statt einer Meldung
         * für jedes einzelne Wand- oder Markerbild.
         */
        if (failedUrls.length > 0) {
            console.warn(
                "JwInf Codecast: Diese Bilder konnten nicht " +
                "eingebettet werden und bleiben online verlinkt:",
                failedUrls
            );
        }

        return failedUrls;
    }

    function findGridSvg() {
        var selectors = [
            "#grid svg",
            "#gridContainer svg",
            ".task-visualization-container svg",
            ".task-visualization svg"
        ];

        var i;
        var svg;

        for (i = 0; i < selectors.length; i++) {
            svg = document.querySelector(selectors[i]);

            if (
                svg &&
                svg.querySelector("rect, path, image")
            ) {
                return svg;
            }
        }

        return null;
    }

    async function exportGridAsSvg() {
        var sourceSvg = findGridSvg();
        var clone;
        var width;
        var height;
        var rect;
        var failedImages;

        if (!sourceSvg) {
            showMessage(
                "Kein Spielfeld-SVG gefunden.",
                true
            );
            return;
        }

        clone = cloneWithInlineStyles(sourceSvg);

        clone.setAttribute(
            "xmlns",
            "http://www.w3.org/2000/svg"
        );

        clone.setAttribute(
            "xmlns:xlink",
            "http://www.w3.org/1999/xlink"
        );

        clone.setAttribute("version", "1.1");

        width = parseFloat(
            sourceSvg.getAttribute("width")
        );

        height = parseFloat(
            sourceSvg.getAttribute("height")
        );

        if (!width || !height) {
            rect = sourceSvg.getBoundingClientRect();

            width = width || rect.width;
            height = height || rect.height;
        }

        clone.setAttribute(
            "width",
            String(width)
        );

        clone.setAttribute(
            "height",
            String(height)
        );

        if (!clone.getAttribute("viewBox")) {
            clone.setAttribute(
                "viewBox",
                "0 0 " + width + " " + height
            );
        }

        /*
         * Positionierung aus der Webseite nicht in die Datei
         * übernehmen.
         */
        clone.style.position = "";
        clone.style.left = "";
        clone.style.top = "";
        clone.style.overflow = "visible";

        failedImages = await embedImagesInSvg(clone);

        downloadTextFile(
            getBaseFilename() + "-spielfeld.svg",
            serializeSvg(clone),
            "image/svg+xml;charset=utf-8"
        );

        if (failedImages.length > 0) {
            showMessage(
                "Spielfeld als SVG gespeichert; einige Bilder " +
                "bleiben online verlinkt."
            );
        } else {
            showMessage(
                "Spielfeld als SVG heruntergeladen."
            );
        }
    }

    function resizeCodeEditorSoon() {
        function dispatchResize() {
            var event;

            if (typeof window.Event === "function") {
                event = new window.Event("resize");
            } else {
                event = document.createEvent("Event");
                event.initEvent("resize", true, true);
            }

            window.dispatchEvent(event);
        }

        dispatchResize();

        window.setTimeout(dispatchResize, 80);
        window.setTimeout(dispatchResize, 250);
    }


    function enhancePythonAvailableBlocks() {
        var container = document.querySelector(
            "#react-container .platform-python #available-blocks"
        );

        if (!container) {
            return;
        }

        var title = container.querySelector(
            ".task-available-blocks-header .title"
        );

        if (
            title &&
            title.textContent !== "Verfügbare Funktionen"
        ) {
            title.textContent = "Verfügbare Funktionen";
        }

        var subtitle = container.querySelector(
            ".task-available-blocks-header .subtitle"
        );

        if (
            subtitle &&
            subtitle.textContent !== "Zum Einfügen anklicken"
        ) {
            subtitle.textContent = "Zum Einfügen anklicken";
        }

        var section = container.closest(
            ".layout-editor-section"
        );

        if (!section) {
            return;
        }

        var editorContainer = section.querySelector(
            ".task-layout-editor-container"
        );

        if (!editorContainer) {
            return;
        }

        var collapser = editorContainer.querySelector(
            ".task-available-blocks-collapser"
        );

        if (!collapser) {
            return;
        }

        /*
         * Nur einmal binden, auch wenn React/MutationObserver
         * die Funktion mehrfach ausführt.
         */
        if (collapser.dataset.jwinfBound === "true") {
            return;
        }

        collapser.dataset.jwinfBound = "true";
        collapser.setAttribute(
            "aria-expanded",
            "true"
        );
        collapser.setAttribute(
            "aria-label",
            "Funktionsliste ausblenden"
        );
        collapser.setAttribute(
            "title",
            "Funktionsliste ausblenden"
        );

        /*
         * Codecasts eigenes Einklappen verhindern und stattdessen
         * nur unsere Klasse auf dem gemeinsamen Layout-Container setzen.
         */
        collapser.addEventListener(
            "click",
            function (event) {
                var collapsed;

                event.preventDefault();
                event.stopPropagation();

                if (
                    typeof event.stopImmediatePropagation ===
                    "function"
                ) {
                    event.stopImmediatePropagation();
                }

                collapsed = !section.classList.contains(
                    "jwinf-python-functions-collapsed"
                );

                section.classList.toggle(
                    "jwinf-python-functions-collapsed",
                    collapsed
                );

                collapser.setAttribute(
                    "aria-expanded",
                    collapsed ? "false" : "true"
                );

                collapser.setAttribute(
                    "aria-label",
                    collapsed
                        ? "Funktionsliste einblenden"
                        : "Funktionsliste ausblenden"
                );

                collapser.setAttribute(
                    "title",
                    collapsed
                        ? "Funktionsliste einblenden"
                        : "Funktionsliste ausblenden"
                );

                resizeCodeEditorSoon();
            },
            true
        );
    }

    /* ---------------------------------------------------------
     * Kompakte Testfallanzeige
     * --------------------------------------------------------- */

    function enhanceTestSelector() {
        var title = document.querySelector(
            "#react-container " +
            ".tests-selector " +
            ".test-title.too-many-tests"
        );

        if (!title) {
            return;
        }

        /*
         * Frühere Varianten des Hinweises entfernen.
         */
        var oldHint = title.querySelector(
            ".jwinf-tests-hint"
        );

        if (oldHint) {
            oldHint.remove();
        }

        var oldInfo = title.querySelector(
            ".jwinf-tests-info"
        );

        if (oldInfo) {
            oldInfo.remove();
        }

        var index = title.querySelector(".test-index");

        if (!index) {
            return;
        }

        /*
         * Sowohl Codecasts ursprüngliches „1/5“ als auch
         * unsere bereits umgewandelte Form unterstützen.
         */
        var countElement = index.querySelector(
            ".jwinf-tests-count"
        );

        var text = countElement
            ? countElement.textContent.trim()
            : index.textContent.trim();

        var match = text.match(
            /^(\d+)\s*(?:\/|von)\s*(\d+)(?:\s+Tests?)?$/i
        );

        if (!match) {
            return;
        }

        var current = match[1];
        var total = match[2];

        /*
         * Nur neu aufbauen, wenn sich der Testfall geändert hat.
         */
        if (
            index.dataset.jwinfCurrent === current &&
            index.dataset.jwinfTotal === total &&
            index.classList.contains("jwinf-tests-status")
        ) {
            return;
        }

        index.dataset.jwinfCurrent = current;
        index.dataset.jwinfTotal = total;
        index.classList.add("jwinf-tests-status");

        index.textContent = "";

        var count = document.createElement("span");
        count.className = "jwinf-tests-count";
        count.textContent =
            current + " von " + total + " Tests";

        var requirement = document.createElement("span");
        requirement.className =
            "jwinf-tests-requirement";
        requirement.textContent =
            "alle müssen bestehen";

        index.appendChild(count);
        index.appendChild(requirement);

        index.setAttribute(
            "aria-label",
            "Testfall " + current +
            " von " + total +
            ". Alle Testfälle müssen bestehen."
        );
    }

    /* ---------------------------------------------------------
 * Codecast-Dokumentation: Aufgabenstellung / Weitere Hinweise
 * --------------------------------------------------------- */

    var jwinfDocumentationNativeSwitch = false;
    var jwinfBulbIconUrl = null;


    function getJwinfModulesBaseUrl() {
        var link = document.querySelector(
            'link[href*="jwinf-codecast.css"]'
        );

        var script;
        var match;

        if (link && link.href) {
            return new URL("../", link.href).href;
        }

        script = document.querySelector(
            'script[src*="_common/modules/"]'
        );

        if (script && script.src) {
            match = script.src.match(
                /^(.*?_common\/modules\/)/
            );

            if (match) {
                return match[1];
            }
        }

        return null;
    }


    function getJwinfBulbIconUrl() {
        var baseUrl;

        if (jwinfBulbIconUrl) {
            return jwinfBulbIconUrl;
        }

        baseUrl = getJwinfModulesBaseUrl();

        if (baseUrl) {
            jwinfBulbIconUrl =
                new URL("img/bulb.svg", baseUrl).href;
        } else {
            jwinfBulbIconUrl =
                "../../../_common/modules/img/bulb.svg";
        }

        return jwinfBulbIconUrl;
    }


    function enhanceDocumentationIcon() {
        var icons = document.querySelectorAll(
            "#react-container .documentation-header-icon " +
            ".bp6-icon-zoom-in, " +
            "#react-container .bp6-icon-help"
        );

        Array.prototype.forEach.call(
            icons,
            function (icon) {
                var svg = icon.querySelector("svg");
                var img = icon.querySelector(
                    ".jwinf-bulb-icon"
                );

                if (svg) {
                    svg.style.display = "none";
                }

                if (!img) {
                    img = document.createElement("img");
                    img.className = "jwinf-bulb-icon";
                    img.alt = "";
                    img.setAttribute("aria-hidden", "true");
                    img.src = getJwinfBulbIconUrl();

                    icon.appendChild(img);
                }
            }
        );
    }


    function setDocumentationLabel(element, label) {
        var spans;
        var lastSpan;

        if (!element) {
            return;
        }

        spans = element.querySelectorAll("span");

        if (spans.length > 0) {
            lastSpan = spans[spans.length - 1];

            if (lastSpan.textContent !== label) {
                lastSpan.textContent = label;
            }

            return;
        }

        if (element.textContent !== label) {
            element.textContent = label;
        }
    }


    function getDocumentationElementText(element) {
        return element
            ? element.textContent
                .replace(/\s+/g, " ")
                .trim()
            : "";
    }


    function markDocumentationTabs(documentation) {
        var tabTitles = documentation.querySelectorAll(
            ".documentation-tab-title"
        );

        Array.prototype.forEach.call(
            tabTitles,
            function (title) {
                var text = getDocumentationElementText(title);
                var tab =
                    title.closest(".documentation-tab") ||
                    title.closest(".documentation-tab-left");

                if (!tab) {
                    return;
                }

                if (
                    text === "Aufgabenhinweise" ||
                    text === "Aufgabenstellung"
                ) {
                    tab.dataset.jwinfDocKind = "task";
                    setDocumentationLabel(
                        title,
                        "Aufgabenstellung"
                    );
                } else if (
                    text === "Programmerstellung" ||
                    text === "Weitere Hinweise" ||
                    text === "Création d'un programme" ||
                    text === "Program creation"
                ) {
                    tab.dataset.jwinfDocKind = "hints";
                    setDocumentationLabel(
                        title,
                        "Weitere Hinweise"
                    );
                } else {
                    tab.dataset.jwinfDocHidden = "true";
                }
            }
        );

        Array.prototype.forEach.call(
            documentation.querySelectorAll(
                ".documentation-category-selector option"
            ),
            function (option) {
                var text = getDocumentationElementText(option);

                if (option.value === "task-instructions") {
                    option.dataset.jwinfDocKind = "task";

                    if (
                        option.textContent !==
                        "Aufgabenstellung"
                    ) {
                        option.textContent =
                            "Aufgabenstellung";
                    }
                } else if (
                    option.value === "language" ||
                    text === "Programmerstellung" ||
                    text === "Weitere Hinweise"
                ) {
                    option.dataset.jwinfDocKind = "hints";

                    if (
                        option.textContent !==
                        "Weitere Hinweise"
                    ) {
                        option.textContent =
                            "Weitere Hinweise";
                    }
                } else {
                    option.hidden = true;
                    option.disabled = true;
                }
            }
        );
    }


    function setDocumentationActiveKind(documentation, kind) {
        var title = documentation.querySelector(
            ".documentation-category-title h2"
        );

        if (kind === "hints") {
            buildJwinfHintsContent(documentation);
        }

        documentation.classList.toggle(
            "jwinf-doc-mode-task",
            kind === "task"
        );

        documentation.classList.toggle(
            "jwinf-doc-mode-hints",
            kind === "hints"
        );

        Array.prototype.forEach.call(
            documentation.querySelectorAll(
                "[data-jwinf-doc-kind]"
            ),
            function (element) {
                element.classList.toggle(
                    "is-active",
                    element.dataset.jwinfDocKind === kind
                );
            }
        );

        if (title) {
            var nextTitle =
                kind === "hints"
                    ? "Weitere Hinweise"
                    : "Aufgabenstellung";

            if (title.textContent !== nextTitle) {
                title.textContent = nextTitle;
            }
        }

        documentation.dataset.jwinfDocKind = kind;
    }

    function getCurrentTaskLevel() {
        var parameters =
            window.taskData &&
                window.taskData.codecastParameters
                ? window.taskData.codecastParameters
                : {};

        var tab;
        var text;

        if (
            window.displayHelper &&
            typeof window.displayHelper.taskLevel === "string"
        ) {
            return window.displayHelper.taskLevel;
        }

        if (typeof parameters.level === "string") {
            return parameters.level;
        }

        if (
            window.taskData &&
            typeof window.taskData.level === "string"
        ) {
            return window.taskData.level;
        }

        tab = document.querySelector(
            ".level-tabs .level-tab.current, " +
            ".levelTabs .current"
        );

        if (tab) {
            text = tab.textContent
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

            if (
                text.indexOf("leicht") !== -1 ||
                text.indexOf("easy") !== -1
            ) {
                return "easy";
            }

            if (
                text.indexOf("mittel") !== -1 ||
                text.indexOf("medium") !== -1
            ) {
                return "medium";
            }

            if (
                text.indexOf("schwer") !== -1 ||
                text.indexOf("hard") !== -1
            ) {
                return "hard";
            }
        }

        return null;
    }


    function elementMatchesCurrentPlatformInMission(element, mission) {
        var platform = getCurrentCodecastPlatform();
        var current = element;
        var lang;

        while (current && current !== mission) {
            if (
                current.getAttribute &&
                current.hasAttribute("data-lang")
            ) {
                lang = current.getAttribute("data-lang");

                if (lang && lang !== platform) {
                    return false;
                }
            }

            current = current.parentElement;
        }

        return true;
    }


    function elementMatchesCurrentLevelInMission(element, mission) {
        var level = getCurrentTaskLevel();
        var current = element;
        var levels = ["easy", "medium", "hard"];
        var i;
        var hasLevelClass = false;

        /*
         * Wenn wir das Level nicht sicher kennen, lassen wir die
         * Level-Filterung lieber Codecast/der bestehenden Aufgabe.
         */
        if (!level) {
            return true;
        }

        while (current && current !== mission) {
            if (current.classList) {
                hasLevelClass = false;

                for (i = 0; i < levels.length; i++) {
                    if (current.classList.contains(levels[i])) {
                        hasLevelClass = true;
                    }
                }

                if (
                    hasLevelClass &&
                    !current.classList.contains(level)
                ) {
                    return false;
                }
            }

            current = current.parentElement;
        }

        return true;
    }


    function longMatchesCurrentContext(longElement, mission) {
        return (
            elementMatchesCurrentPlatformInMission(
                longElement,
                mission
            ) &&
            elementMatchesCurrentLevelInMission(
                longElement,
                mission
            )
        );
    }


    function cleanHintClone(clone) {
        /*
         * Alte Überschrift aus .long entfernen, weil die Doku
         * selbst schon „Weitere Hinweise“ anzeigt.
         */
        Array.prototype.forEach.call(
            clone.querySelectorAll("h1, h2, h3"),
            function (heading) {
                var text = heading.textContent
                    .replace(/\s+/g, " ")
                    .trim()
                    .toLowerCase();

                if (text.indexOf("weitere hinweise") !== -1) {
                    heading.remove();
                }
            }
        );

        /*
         * Führende Trennlinien entfernen.
         */
        Array.prototype.forEach.call(
            clone.querySelectorAll("hr"),
            function (hr) {
                hr.remove();
            }
        );

        /*
         * Keine alten Codecast-Buttons in den Hinweisen.
         */
        Array.prototype.forEach.call(
            clone.querySelectorAll(
                "button, .quickalgo-button"
            ),
            function (button) {
                button.remove();
            }
        );
    }


    function buildJwinfHintsContent(documentation) {
        var mission = documentation.querySelector(
            ".documentation-task-instructions .task-mission"
        );

        var container;
        var longs;
        var signature;
        var added = false;

        if (!mission) {
            return;
        }

        container = mission.querySelector(
            ".jwinf-doc-hints-content"
        );

        if (!container) {
            container = document.createElement("div");
            container.className = "jwinf-doc-hints-content";
            mission.appendChild(container);
        }

        longs = Array.prototype.slice.call(
            mission.querySelectorAll(".long")
        ).filter(function (longElement) {
            return (
                !longElement.closest(".jwinf-doc-hints-content") &&
                longMatchesCurrentContext(longElement, mission)
            );
        });

        signature = [
            getCurrentCodecastPlatform(),
            getCurrentTaskLevel() || "",
            longs.map(function (longElement) {
                return longElement.outerHTML;
            }).join("\u001f")
        ].join("\u001e");

        if (
            container.__jwinfHintsSignature === signature
        ) {
            return;
        }

        /*
         * Nur unseren eigenen Container leeren, nicht Reacts Inhalt.
         */
        container.innerHTML = "";

        longs.forEach(function (longElement) {
            var clone = longElement.cloneNode(true);
            var block = document.createElement("div");

            block.className = "jwinf-doc-hint-block";

            cleanHintClone(clone);

            while (clone.firstChild) {
                block.appendChild(clone.firstChild);
            }

            container.appendChild(block);
            added = true;
        });

        if (!added) {
            container.innerHTML =
                "<p>Für diese Aufgabe gibt es keine weiteren Hinweise.</p>";
        }

        container.__jwinfHintsSignature = signature;
    }

    function ensureDocumentationTaskContent(documentation, callback) {
        var select;
        var event;

        if (
            documentation.querySelector(
                ".documentation-task-instructions"
            )
        ) {
            callback();
            return;
        }

        select = documentation.querySelector(
            ".documentation-category-selector select"
        );

        if (!select) {
            callback();
            return;
        }

        jwinfDocumentationNativeSwitch = true;

        select.value = "task-instructions";

        if (typeof window.Event === "function") {
            event = new window.Event("change", {
                bubbles: true
            });
        } else {
            event = document.createEvent("Event");
            event.initEvent("change", true, true);
        }

        select.dispatchEvent(event);

        window.setTimeout(function () {
            jwinfDocumentationNativeSwitch = false;
            callback();
        }, 100);
    }


    function handleDocumentationTabClick(documentation, event) {
        var tab = event.target.closest(
            ".documentation-tab, .documentation-tab-left"
        );

        var kind;

        if (
            !tab ||
            !tab.dataset ||
            !tab.dataset.jwinfDocKind
        ) {
            return;
        }

        kind = tab.dataset.jwinfDocKind;

        /*
         * React soll hier nicht auf „Programmerstellung“ wechseln,
         * weil dann wieder der iframe gerendert würde.
         */
        event.preventDefault();
        event.stopPropagation();

        if (
            typeof event.stopImmediatePropagation ===
            "function"
        ) {
            event.stopImmediatePropagation();
        }

        ensureDocumentationTaskContent(
            documentation,
            function () {
                markDocumentationTabs(documentation);
                setDocumentationActiveKind(documentation, kind);
            }
        );
    }


    function handleDocumentationSelectChange(documentation, event) {
        var select = event.target.closest(
            ".documentation-category-selector select"
        );

        var option;
        var kind;

        if (!select || jwinfDocumentationNativeSwitch) {
            return;
        }

        option = select.options[select.selectedIndex];

        if (
            !option ||
            !option.dataset ||
            !option.dataset.jwinfDocKind
        ) {
            return;
        }

        kind = option.dataset.jwinfDocKind;

        event.preventDefault();
        event.stopPropagation();

        if (
            typeof event.stopImmediatePropagation ===
            "function"
        ) {
            event.stopImmediatePropagation();
        }

        ensureDocumentationTaskContent(
            documentation,
            function () {
                markDocumentationTabs(documentation);
                setDocumentationActiveKind(documentation, kind);
            }
        );
    }

    function getCurrentCodecastPlatform() {
        var parameters =
            window.taskData &&
                window.taskData.codecastParameters
                ? window.taskData.codecastParameters
                : {};

        if (parameters.platform) {
            return parameters.platform;
        }

        if (
            document.querySelector(
                "#react-container .platform-python"
            )
        ) {
            return "python";
        }

        return "blockly";
    }


    function enhanceCodecastDocumentation() {
        var documentation = document.querySelector(
            "#react-container .documentation"
        );

        if (!documentation) {
            return;
        }

        enhanceDocumentationIcon();
        markDocumentationTabs(documentation);

        if (documentation.dataset.jwinfBound !== "true") {
            documentation.dataset.jwinfBound = "true";

            documentation.addEventListener(
                "click",
                function (event) {
                    handleDocumentationTabClick(
                        documentation,
                        event
                    );
                },
                true
            );

            documentation.addEventListener(
                "change",
                function (event) {
                    handleDocumentationSelectChange(
                        documentation,
                        event
                    );
                },
                true
            );
        }

        /*
         * Beim ersten Öffnen automatisch „Weitere Hinweise“
         * anzeigen, aber React weiterhin auf der Aufgabenhinweis-
         * Ansicht lassen.
         */
        if (documentation.dataset.jwinfOpenedHints !== "true") {
            documentation.dataset.jwinfOpenedHints = "true";

            ensureDocumentationTaskContent(
                documentation,
                function () {
                    markDocumentationTabs(documentation);
                    setDocumentationActiveKind(
                        documentation,
                        "hints"
                    );
                }
            );

            return;
        }

        setDocumentationActiveKind(
            documentation,
            documentation.dataset.jwinfDocKind || "hints"
        );
    }

    function makeRobotStartBlocksMovable() {
        var workspace;
        var blocks;
        var i;
        var block;

        if (!usesBlockly()) {
            return;
        }

        workspace = getWorkspace();

        if (
            !workspace ||
            typeof workspace.getAllBlocks !== "function"
        ) {
            return;
        }

        blocks = workspace.getAllBlocks(false);

        for (i = 0; i < blocks.length; i++) {
            block = blocks[i];

            if (!block || block.type !== "robot_start") {
                continue;
            }

            /*
             * Der Startbaustein soll verschiebbar sein,
             * aber nicht löschbar oder editierbar.
             */
            if (
                typeof block.setMovable === "function" &&
                (
                    typeof block.isMovable !== "function" ||
                    !block.isMovable()
                )
            ) {
                block.setMovable(true);
            }

            if (
                typeof block.setDeletable === "function" &&
                (
                    typeof block.isDeletable !== "function" ||
                    block.isDeletable()
                )
            ) {
                block.setDeletable(false);
            }

            if (
                typeof block.setEditable === "function" &&
                (
                    typeof block.isEditable !== "function" ||
                    block.isEditable()
                )
            ) {
                block.setEditable(false);
            }
        }
    }


    ensureQuickAlgoLibraryRegistryPatch();
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );
    } else {
        initialize();
    }

})();
