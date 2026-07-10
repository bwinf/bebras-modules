/*
 * Zusätzliche JwInf-Bedienelemente für Codecast 7.7
 *
 * Fügt dem Codecast-Menü folgende Aktionen hinzu:
 * - Kopieren
 * - Einfügen
 * - Rückgängig
 * - Wiederherstellen
 * - SVG-Esporte
 */

(function () {
    "use strict";

    var toastTimer = null;
    var observerScheduled = false;


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


    function enhanceBlocklyToolboxCollapser() {
        var elements = getBlocklyToolboxElements();
        var root = elements.root;
        var injectionDiv = elements.injectionDiv;

        if (!root || !injectionDiv) {
            return;
        }

        var existingButton = injectionDiv.querySelector(
            ".jwinf-blockly-toolbox-collapser"
        );

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

        injectionDiv.appendChild(button);

        positionBlocklyToolboxCollapser(button);

        window.setTimeout(function () {
            positionBlocklyToolboxCollapser(button);
        }, 150);

        window.addEventListener("resize", function () {
            positionBlocklyToolboxCollapser(button);
        });
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
    function ensureMenuItems() {
        observerScheduled = false;
        enhanceTestSelector();
        enhancePythonAvailableBlocks();
        enhanceBlocklyToolboxCollapser();
        enhanceCodecastDocumentation();
        makeRobotStartBlocksMovable();

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


    function scheduleEnsureMenuItems() {
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

        if (title) {
            title.textContent = "Verfügbare Funktionen";
        }

        var subtitle = container.querySelector(
            ".task-available-blocks-header .subtitle"
        );

        if (subtitle) {
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
            lastSpan.textContent = label;
            return;
        }

        element.textContent = label;
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
                    option.textContent = "Aufgabenstellung";
                } else if (
                    option.value === "language" ||
                    text === "Programmerstellung" ||
                    text === "Weitere Hinweise"
                ) {
                    option.dataset.jwinfDocKind = "hints";
                    option.textContent = "Weitere Hinweise";
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
            title.textContent =
                kind === "hints"
                    ? "Weitere Hinweise"
                    : "Aufgabenstellung";
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

        /*
         * Nur unseren eigenen Container leeren, nicht Reacts Inhalt.
         */
        container.innerHTML = "";

        longs = Array.prototype.slice.call(
            mission.querySelectorAll(".long")
        ).filter(function (longElement) {
            return (
                !longElement.closest(".jwinf-doc-hints-content") &&
                longMatchesCurrentContext(longElement, mission)
            );
        });

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


    function longElementMatchesPlatform(element) {
        var lang = element.getAttribute("data-lang");
        var platform = getCurrentCodecastPlatform();

        return !lang || lang === platform;
    }


    function markLongHeadings(longElement) {
        Array.prototype.forEach.call(
            longElement.querySelectorAll("h1, h2, h3"),
            function (heading) {
                var text = heading.textContent
                    .replace(/\s+/g, " ")
                    .trim()
                    .toLowerCase();

                if (text.indexOf("weitere hinweise") !== -1) {
                    heading.classList.add(
                        "jwinf-doc-hide-in-hints"
                    );
                }
            }
        );

        Array.prototype.forEach.call(
            longElement.querySelectorAll("hr"),
            function (hr) {
                hr.classList.add("jwinf-doc-hide-in-hints");
            }
        );
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

            if (typeof block.setDeletable === "function") {
                block.setDeletable(false);
            }

            if (typeof block.setEditable === "function") {
                block.setEditable(false);
            }
        }
    }



    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );
    } else {
        initialize();
    }

})();
