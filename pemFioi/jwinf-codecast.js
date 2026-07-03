/*
 * Zusätzliche JwInf-Bedienelemente für Codecast 7.7
 *
 * Fügt dem Codecast-Menü folgende Aktionen hinzu:
 * - Kopieren
 * - Einfügen
 * - Rückgängig
 * - Wiederherstellen
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

        return parameters.jwinfMenu || {};
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

        if (!Blockly) {
            return null;
        }

        /*
         * Je nach Blockly-Version existiert eine dieser Varianten.
         */
        if (typeof Blockly.getMainWorkspace === "function") {
            var workspace = Blockly.getMainWorkspace();

            if (workspace) {
                return workspace;
            }
        }

        if (Blockly.mainWorkspace) {
            return Blockly.mainWorkspace;
        }

        /*
         * Codecast setzt clipboardSource_ beim Wiederherstellen der
         * Zwischenablage auf den aktuellen Workspace.
         */
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
                    ? "Es gibt nichts zum wieder herstellen."
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
        if (action === "copy") {
            copyBlocks();
        } else if (action === "paste") {
            pasteBlocks();
        } else if (action === "undo") {
            undo();
        } else if (action === "redo") {
            redo();
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
        var definitions = [];

        if (settings.copyPaste !== false) {
            definitions.push({
                action: "copy",
                label: "Kopieren"
            });

            definitions.push({
                action: "paste",
                label: "Einfügen"
            });
        }

        if (settings.undoRedo !== false) {
            definitions.push({
                action: "undo",
                label: "Rückgängig"
            });

            definitions.push({
                action: "redo",
                label: " Wiederherstellen"
            });
        }

        var fragment = document.createDocumentFragment();
        var added = false;
        var i;
        var definition;

        for (i = 0; i < definitions.length; i++) {
            definition = definitions[i];

            if (
                document.getElementById(
                    "jwinf-codecast-menu-" +
                    definition.action
                )
            ) {
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

        window.setTimeout(ensureMenuItems, 0);
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

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
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

    var hint = title.querySelector(
        ".jwinf-tests-hint"
    );

    if (!hint) {
        hint = document.createElement("span");
        hint.className = "jwinf-tests-hint";

        hint.appendChild(
            document.createTextNode("• Dein Programm muss ")
        );

        var importantText = document.createElement("strong");
        importantText.textContent = "alle";
        hint.appendChild(importantText);

        hint.appendChild(
            document.createTextNode(" Testfälle bestehen.")
        );

        title.appendChild(hint);
    }

    var index = title.querySelector(".test-index");

    if (!index) {
        return;
    }

    var match = index.textContent
        .trim()
        .match(/^(\d+)\s*\/\s*(\d+)$/);

    if (!match) {
        return;
    }

    index.textContent =
        match[1] + " von " + match[2];

    index.setAttribute(
        "aria-label",
        "Testfall " + match[1] +
        " von " + match[2]
    );
}