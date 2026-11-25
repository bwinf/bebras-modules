/*blocklyRoboy_lib-1.0.0 by Arthur Léonard*/

/*TODO : un changement de taille de la fenetre à la fin d'une execution duplique les items*/
/*TODO : traduire le context wiring*/
var robotCommands = [];

var BLOCKLY_ROBOT_VERSION = '1.1';
var imgPath = modulesPath+"img/algorea/";

var initArray = function(n, elem) {
   var res = [];
   for(var i = 0;i < n;i++) {
      res.push(elem);
   }
   return res;
}

var getContext = function(display, infos, curLevel) {
   var localLanguageStrings = {
      fr: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      en: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      nl: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      es: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      it: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      de: {
        label: {
         controls_repeat_ext: "Wiederhole X Mal"
        },
        code: {},
        messages: {},
        description: {}
      }
   };
   
   var contextStrings = {
      none: {
         fr: {
            label: {
               row: "ligne du robot",
               col: "colonne du robot",
               wait: "attendre",
               north: "avancer vers le nord",
               south: "avancer vers le sud",
               east: "avancer vers l'est",
               west: "avancer vers l'ouest",
               left: "tourner à gauche",
               right: "tourner à droite",
               turnAround: "faire demi-tour",
               forward: "avancer",
               backwards: "reculer",
               jump: "sauter",
               obstacleInFront: "obstacle devant",
               obstacleEast: "obstacle à l'est",
               obstacleWest: "obstacle à l'ouest",
               obstacleNorth: "obstacle au nord",
               obstacleSouth: "obstacle au sud",
               obstacleRight: "obstacle à droite",
               obstacleLeft: "obstacle à gauche",
               gridEdgeEast: "bord de la grille à l'est",
               gridEdgeWest: "bord de la grille à l'ouest",
               gridEdgeNorth: "bord de la grille au nord",
               gridEdgeSouth: "bord de la grille au sud",
               platformInFront: "plateforme devant",
               platformAbove: "plateforme au-dessus",
               withdrawObject: "ramasser l'objet",
               dropObject: "déposer l'objet",
               onObject: "sur un objet",
               onContainer: "sur un conteneur",
               onNumber: "sur un nombre",
               onWritable: "sur un tableau",
               onLauncher: "sur un lanceur laser",
               writeNumber: "écrire le nombre",
               readNumber: "nombre de la case",
               pushObject: "pousser l'objet",
               pushableInFront: "poussable devant",
               dropNum: "déposer %1 objets",
               dropNum_noShadow: "déposer %1 objets",
               nbWithdrawables: "nombre d'objets sur la case",
               nbInBag: "nombre d'objets dans le sac",
               containerSize: "nombre d'objets à déposer sur la case",
               withdrawNum: "ramasser %1 objets",
               withdrawNum_noShadow: "ramasser %1 objets",
               shoot: "tirer au laser dans la direction %1",
               shoot_noShadow: "tirer au laser dans la direction %1",
               shootCondition: "retour départ tir direction %1",
               shootCondition_noShadow: "retour départ tir direction %1",
               connect: "brancher un câble",
               onMale: "sur une prise mâle",
               onFemale: "sur une prise femelle",
               dropPlatformInFront: "construire une plateforme devant",
               dropPlatformAbove: "construire une plateforme au-dessus"
               
            },
            code: {
               row: "ligneRobot",
               col: "colonneRobot",
               wait: "attendre",
               north: "nord",
               south: "sud",
               east: "est",
               west: "ouest",
               left: "tournerGauche",
               right: "tournerDroite",
               turnAround: "demiTour",
               forward: "avancer",
               backwards: "reculer",
               jump: "sauter",
               obstacleInFront: "obstacleDevant",
               obstacleEast: "obstacleEst",
               obstacleWest: "obstacleOuest",
               obstacleNorth: "obstacleNord",
               obstacleSouth: "obstacleSud",
               obstacleRight: "obstacleDroite",
               obstacleLeft: "obstacleGauche",
               gridEdgeEast: "bordGrilleEst",
               gridEdgeWest: "bordGrilleOuest",
               gridEdgeNorth: "bordGrilleNord",
               gridEdgeSouth: "bordGrilleSud",
               platformInFront: "plateformeDevant",
               platformAbove: "plateformeDessus",
               withdrawObject: "ramasserObjet",
               dropObject: "deposerObjet",
               onObject: "surObjet",
               onContainer: "surConteneur",
               onNumber: "surNombre",
               onWritable: "surTableau",
               onLauncher: "surLanceur",
               writeNumber: "ecrireNombre",
               readNumber: "nombreSurCase",
               pushObject: "pousserObjet",
               pushableInFront: "poussableDevant",
               dropNum: "deposer",
               dropNum_noShadow: "deposer",
               containerSize: "nbObjetsADeposer",
               nbInBag: "nbObjetsDansSac",
               nbWithdrawables: "nbObjetsSur",
               withdrawNum: "ramasser",
               withdrawNum_noShadow: "ramasser",
               shoot: "tirerLaser",
               shoot_noShadow: "tirerLaser",
               shootCondition: "tirerCondition",
               shootCondition_noShadow: "tirerCondition",
               connect: "brancherCable",
               onMale: "surMale",
               onFemale: "surFemelle",
               dropPlatformInFront: "construirePlateformeDevant",
               dropPlatformAbove: "construirePlateformeAuDessus"
            },
            description: {
               forward: "avancer() fait avancer le robot d'une case",
               backwards: "reculer() fait reculer le robot d'une case",
               left: "tournerGauche() fait se tourner le robot d'un quart de tour à gauche",
               right: "tournerDroite() fait se tourner le robot d'un quart de tour à droite",
               row: "ligneRobot() retourne le numéro de la ligne du robot",
               col: "colonneRobot() retourne le numéro de la colonne du robot",
               turnAround: "demiTour() fait faire demi-tour au robot",
               east: "est() déplace le robot d'une case vers l'est",
               west: "ouest() déplace le robot d'une case vers l'oest",
               north: "nord() déplace le robot d'une case vers le nord",
               south: "sud() déplace le robot d'une case vers le sud",
            },
            messages: {
               leavesGrid: "Le robot sort de la grille !",
               obstacle: "Le robot essaie de se déplacer sur un obstacle !",
               nothingToPickUp: "Il n'y a rien à ramasser !",
               nothingToLookAt: "Il n'y a ni carte ni conteneur sur cette case",
               falls: "Le robot va se jeter dans le vide !",
               willFallAndCrash: "Le robot va tomber de haut et s'écraser !",
               jumpOutsideGrid: "Le robot essaie de sauter en dehors de la grille !",
               jumpObstacleBlocking: "Le robot essaie de sauter mais il y a un obstacle qui le bloque",
               jumpNoPlatform: "Le robot essaie de sauter mais il n'y a pas de plateforme au dessus !",
               tooManyObjects: "Le robot essaie de transporter trop d'objets à la fois !",
               emptyBag: "Le robot essaie de déposer un objet alors qu'il n'en transporte pas !",
               successReachExit: "Bravo, votre robot a atteint la sortie !",
               failureReachExit: "Votre robot n'a pas atteint la sortie.",
               successPickedAllWithdrawables: "Bravo, votre robot a tout ramassé !",
               failurePickedAllWithdrawables: "Votre robot n'a pas tout ramassé.",
               successContainersFilled: "Bravo, votre robot a rempli tous les conteneurs",
               failureContainersFilled: "Il y a un objet hors des conteneurs",
               failureContainersFilledLess: "Votre robot n'a pas rempli tous les conteneurs",
               failureContainersFilledBag: "Votre robot n'a pas posé tous les objets",
               failureUnfilteredObject: "Votre robot a ramassé un objet invalide",
               failureTooManyMoves: "Votre robot a effectué trop de déplacements.",
               failureWriteHere: "Votre robot ne peut pas écrire ici !",
               failureNothingToWrite: "Der Roboter hat nichts, was er schreiben soll.", //TODO
               failureReadHere: "Il n'y a pas de nombre écrit ici !",
               successNumbersWritten: "Bravo, votre robot a écrit les bons nombres !",
               failureNumbersWritten: "Votre robot n'a pas écrit les bons nombres !",
               failureNothingToPush: "Il n'y a pas d'objet à pousser !",
               failureWhilePushing: "Le robot ne peut pas pousser cet objet !",
               failureDropObject: "On ne peut pas poser d'objet ici",
               failureDropPlatform: "Il y a déjà une plateforme ici",
               failureDropOutside: "Votre robot essaie de poser un objet hors de la grille",
               failureNotEnoughPlatform: "Pas assez de plateformes",
               failureLights: "Il reste des spots à allumer.",
               successLights: "Bravo, votre robot a allumé tous les spots !",
               failureLaser: "Le robot doit se trouver sur une borne laser pour pouvoir tirer !",
               failureNoPlug: "Le robot doit se trouver sur une prise pour pouvoir brancher un câble !",
               failureAlreadyWired: "Cette prise est déjà connectée à un câble !",
               failureWrongPlugType: "On ne peut pas connecter ces prises ensemble !",
               successPlugsWired: "La machine est réparée !",
               failurePlugsWired: "La machine ne fonctionne pas car des prises n'ont pas été connectées !",
               failureWireCrossing: "Impossible de relier ces deux prises, deux câbles vont s'intersecter !",
               failureWireTooLong: "Impossible de relier ces deux prises car elles sont trop éloignées !",
               failureTotalLengthExceeded: "Vous n'avez pas assez de longueur de câble pour relier ces deux prises !",
               failureProjectile: "Le robot s'est pris un projectile !",
               failureRewrite: "Le robot a essayé de repeindre une case.",
               noContainer: "Il n'y a pas de conteneur ici !"
            },
            cardinals: {
               north: "Nord",
               south: "Sud",
               west: "Ouest",
               east: "Est"
            },
            startingBlockName: "Programme du robot"
         },
         en: {
            label: {
               row: "robot's row",
               col: "robot's column",
               wait: "wait",
               north: "move up",
               south: "move down",
               east: "move right",
               west: "move left",
               left: "turn left",
               right: "turn right",
               turnAround: "turn around",
               forward: "move forward",
               backwards: "move backwards",
               jump: "jump",
               obstacleInFront: "obstacle ahead",
               obstacleEast: "obstacle on the right",
               obstacleWest: "obstacle on the left",
               obstacleNorth: "obstacle above",
               obstacleSouth: "obstacle below",
               obstacleRight: "obstacle on the right",
               obstacleLeft: "obstacle on the left",
               gridEdgeEast: "grid edge on the right",
               gridEdgeWest: "grid edge on the left",
               gridEdgeNorth: "grid edge above",
               gridEdgeSouth: "grid edge below",
               platformInFront: "platform ahead",
               platformAbove: "platform above",
               withdrawObject: "pick the object",
               dropObject: "drop the object",
               onObject: "on an object",
               onContainer: "on a container",
               onNumber: "on a number",
               onWritable: "on a blackboard",
               onLauncher: "on a laser emitter",
               writeNumber: "write the number",
               readNumber: "number in the cell",
               pushObject: "push the object",
               pushableInFront: "pushable object ahead",
               shoot: "shoot a laser in direction %1",
               shoot_noShadow: "shoot a laser in direction %1",
               shootCondition: "laser shot returning to starting point in direction %1",
               shootCondition_noShadow: "laser shot returning to starting point in direction %1",
               connect: "plug a wire",
               onMale: "to a male plug",
               onFemale: "to a female plug",
               dropPlatformInFront: "drop platform in front",
               dropPlatformAbove: "drop platform above"
               
            },
            code: {
               row: "robotRow",
               col: "robotColumn",
               wait: "wait",
               north: "up",
               south: "down",
               east: "right",
               west: "left",
               left: "turnLeft",
               right: "turnRight",
               turnAround: "turnAround",
               forward: "forward",
               backwards: "backwards",
               jump: "jump",
               obstacleInFront: "obstacleAhead",
               obstacleEast: "obstacleRight",
               obstacleWest: "obstacleLeft",
               obstacleNorth: "obstacleAbove",
               obstacleSouth: "obstacleBelow",
               obstacleRight: "obstacleRightRel",
               obstacleLeft: "obstacleLeftRel",
               gridEdgeEast: "gridEdgeRight",
               gridEdgeWest: "gridEdgeLeft",
               gridEdgeNorth: "gridEdgeAbove",
               gridEdgeSouth: "gridEdgeBelow",
               platformInFront: "plateformAhead",
               platformAbove: "platformAbove",
               withdrawObject: "pickObject",
               dropObject: "dropObject",
               onObject: "onObject",
               onContainer: "onContainer",
               onNumber: "onNumber",
               onWritable: "onWritable",
               onLauncher: "onLauncher",
               writeNumber: "writeNumber",
               readNumber: "numberOnCell",
               pushObject: "pushObject",
               pushableInFront: "pushableAhead",
               shoot: "shootLaser",
               shoot_noShadow: "shootLaser",
               shootCondition: "shootOnCondition",
               shootCondition_noShadow: "shootOnCondition",
               connect: "plugCable",
               onMale: "onMalePlug",
               onFemale: "onFemalePlug",
               dropPlatformInFront: "dropPlatformInFront",
               dropPlatformAbove: "dropPlatformAbove"
            },
            messages: {
               leavesGrid: "The robot exits the grid!",
               obstacle: "The robot attempts to move towards an obstacle!",
               nothingToPickUp: "There is nothing to puck up!",
               nothingToLookAt: "There is no card or container in this cell",
               falls: "The robot will leap into the void",
               willFallAndCrash: "The robot will jump from a high point and crash!",
               jumpOutsideGrid: "The robot tries to jump outside of the grid!",
               jumpObstacleBlocking: "The robot tries to jump but an obstacle blacks it",
               jumpNoPlatform: "The robot tries to jump but there is no platform above!",
               tooManyObjects: "The robot tries to transport too many objects at a time!",
               emptyBag: "The robot tries to drop an object but it doesn't carry one!",
               successReachExit: "Congratulations, your robot reached the exit!",
               failureReachExit: "Your robot didn't reach the exit.",
               successPickedAllWithdrawables: "Congratulations, your robot picked up everything!",
               failurePickedAllWithdrawables: "Your robot didn't pick up everything.",
               successContainersFilled: "Congratulations, your robot filled every container",
               failureContainersFilled: "An object was left outside of containers",
               failureContainersFilledLess: "Yout robot didn't fill every container",
               failureContainersFilledBag: "Your robot didn't drop all the objects",
               failureUnfilteredObject: "Your robot picked an invalid object",
               failureTooManyMoves: "Your robot made too many moves.",
               failureWriteHere: "Your robot can't write here!",
               failureNothingToWrite: "Der Roboter hat nichts, was er schreiben soll.", //TODO
               failureReadHere: "There is no number written here!",
               successNumbersWritten: "Congratulations, your robot wrote all the correct numbers!",
               failureNumbersWritten: "Your robot didn't write the correct numbers!",
               failureNothingToPush: "There is no object to push!",
               failureWhilePushing: "The robot can't push this object!",
               failureDropObject: "You can't drop an platform here",
               failureDropPlatform: "You can't drop an object here",
               failureDropOutside: "Your robot tries to drop an object outside of the grid",
               failureNotEnoughPlatform: "Not enough platforms",
               failureLights: "There are still lights to turn on.",
               successLights: "Congratulations, your robot turned on all the lights!",
               failureLaser: "The robot has to be on a launcher to be able to shoot!",
               failureNoPlug: "The robot has to be on a plug to plug in a cable!",
               failureAlreadyWired: "This plug is already connected to a cable!",
               failureWrongPlugType: "You can't connect these plugs together!",
               successPlugsWired: "The machine is fixed!",
               failurePlugsWired: "The machine doesn't work because some plugs are not connected!",
               failureWireCrossing: "Impossible to connect these two plugs: two cables would intersect!",
               failureWireTooLong: "Impossible to connect these two plugs: they are too far from eachother!",
               failureTotalLengthExceeded: "You don't have enough length of cable to connect these two plugs!",
               failureProjectile: "The robot got hit by a projectile!"
            },
            cardinals: {
               north: "North",
               south: "South",
               west: "West",
               east: "East"
            },
            startingBlockName: "Robot program"
         },
         nl: {
            label: {
               row: "rij van de robot",
               col: "kolom van de robot",
               wait: "wachten",
               north: "beweeg omhoog",
               south: "beweeg omlaag",
               east: "beweeg naar rechts",
               west: "beweeg naar links",
               left: "draai naar links",
               right: "draai naar rechts",
               turnAround: "draai om",
               forward: "beweeg vooruit",
               backwards: "beweeg achteruit",
               jump: "spring",
               obstacleInFront: "obstakel voor",
               obstacleEast: "obstakel rechts",
               obstacleWest: "obstakel links",
               obstacleNorth: "obstakel boven",
               obstacleSouth: "obstakel onder",
               obstacleRight: "obstakel rechts",
               obstacleLeft: "obstakel links",
               gridEdgeEast: "rand van het rooster rechts",
               gridEdgeWest: "rand van het rooster links",
               gridEdgeNorth: "rand van het rooster boven",
               gridEdgeSouth: "rand van het rooster onder",
               platformInFront: "platform voor",
               platformAbove: "platform boven",
               withdrawObject: "raap het object op",
               dropObject: "leg het object neer",
               onObject: "op een object",
               onContainer: "op een container",
               onExit: "op een uitgang",
               onNumber: "op een nummer",
               onWritable: "op een bord",
               onLauncher: "op een laserlanceerder",
               writeNumber: "schrijf het nummer",
               readNumber: "nummer van het vakje",
               pushObject: "duw het object",
               pushableInFront: "duwbaar object voor",
               dropNum: "leg %1 objecten neer",
               dropNum_noShadow: "leg %1 objecten neer",
               nbWithdrawables: "aantal objecten op het vakje",
               nbInBag: "aantal objecten in de zak",
               containerSize: "aantal neer te leggen objecten op het vakje",
               withdrawNum: "raap %1 objecten op",
               withdrawNum_noShadow: "raap %1 objecten op",
               shoot: "schiet een laser in richting %1",
               shoot_noShadow: "schiet een laser in richting %1",
               shootCondition: "laserschot keert terug naar startpunt in richting %1",
               shootCondition_noShadow: "laserschot keert terug naar startpunt in richting %1",
               connect: "sluit een kabel aan",
               onMale: "op een mannelijke stekker",
               onFemale: "op een vrouwelijke stekker",
               dropPlatformInFront: "bouw een platform voor",
               dropPlatformAbove: "bouw een platform boven"
            },
            code: {
               row: "rijRobot",
               col: "kolomRobot",
               wait: "wachten",
               north: "omhoog",
               south: "omlaag",
               east: "rechts",
               west: "links",
               left: "draaiLinks",
               right: "draaiRechts",
               turnAround: "draaiOm",
               forward: "vooruit",
               backwards: "achteruit",
               jump: "spring",
               obstacleInFront: "obstakelVoor",
               obstacleEast: "obstakelRechts",
               obstacleWest: "obstakelLinks",
               obstacleNorth: "obstakelBoven",
               obstacleSouth: "obstakelOnder",
               obstacleRight: "obstakelRechtsRel",
               obstacleLeft: "obstakelLinksRel",
               gridEdgeEast: "roosterrandRechts",
               gridEdgeWest: "roosterrandLinks",
               gridEdgeNorth: "roosterrandBoven",
               gridEdgeSouth: "roosterrandOnder",
               platformInFront: "platformVoor",
               platformAbove: "platformBoven",
               withdrawObject: "objectOprapen",
               dropObject: "objectNeerleggen",
               onObject: "opObject",
               onContainer: "opContainer",
               onNumber: "opNummer",
               onWritable: "opBord",
               onLauncher: "opLanceerder",
               writeNumber: "schrijfNummer",
               readNumber: "nummerOpVakje",
               pushObject: "duwObject",
               pushableInFront: "duwbaarVoor",
               dropNum: "neerleggen",
               dropNum_noShadow: "neerleggen",
               containerSize: "aantalObjectenNeerTeLeggen",
               nbInBag: "aantalObjectenInZak",
               nbWithdrawables: "aantalObjectenOp",
               withdrawNum: "oprapen",
               withdrawNum_noShadow: "oprapen",
               shoot: "schietLaser",
               shoot_noShadow: "schietLaser",
               shootCondition: "schietOpVoorwaarde",
               shootCondition_noShadow: "schietOpVoorwaarde",
               connect: "verbindKabel",
               onMale: "opMannelijkeStekker",
               onFemale: "opVrouwelijkeStekker",
               dropPlatformInFront: "bouwPlatformVoor",
               dropPlatformAbove: "bouwPlatformBoven"
            },
            description: {
               forward: "vooruit() beweegt de robot een vakje vooruit",
               backwards: "achteruit() beweegt de robot een vakje achteruit",
               left: "draaiLinks() draait de robot een kwartslag naar links",
               right: "draaiRechts() draait de robot een kwartslag naar rechts",
               row: "rijRobot() geeft het rijnummer van de robot terug",
               col: "kolomRobot() geeft het kolomnummer van de robot terug",
               turnAround: "draaiOm() laat de robot omdraaien",
               east: "rechts() verplaatst de robot een vakje naar rechts",
               west: "links() verplaatst de robot een vakje naar links",
               north: "omhoog() verplaatst de robot een vakje omhoog",
               south: "omlaag() verplaatst de robot een vakje omlaag",
               shoot: "schietLaser(richting) laat de robot een laserstraal afvuren in de opgegeven richting",
               shoot_noShadow: "schietLaser() laat de robot een laserstraal afvuren in de opgegeven richting",
               readNumber: "nummerOpVakje() sensor die het nummer leest op het vakje waar de robot staat",
               writeNumber: "schrijfNummer(nummer) schrijft het nummer uit de parameter op het vakje van de robot",
               withdrawObject: "objectOprapen() raapt het object op het vakje van de robot op",
               dropObject: "objectNeerleggen() legt het object neer op het vakje van de robot",
               platformInFront: "platformVoor() test of er een platform voor de robot is",
               platformAbove: "platformBoven() test of er een platform boven de robot is",
               dropPlatformInFront: "bouwPlatformVoor() bouwt een platform op het vakje voor de robot",
               jump: "spring() laat de robot op het platform vlak boven hem springen"
            },
            messages: {
               leavesGrid: "De robot verlaat het rooster!",
               obstacle: "De robot probeert naar een obstakel te bewegen!",
               nothingToPickUp: "Er is niets om op te rapen!",
               nothingToLookAt: "Er is geen kaart of container op dit vakje",
               falls: "De robot gaat in de leegte vallen",
               willFallAndCrash: "De robot gaat van een hoogte vallen en neerstorten!",
               jumpOutsideGrid: "De robot probeert buiten het rooster te springen!",
               jumpObstacleBlocking: "De robot probeert te springen, maar een obstakel blokkeert hem",
               jumpNoPlatform: "De robot probeert te springen, maar er is geen platform boven!",
               tooManyObjects: "De robot probeert te veel objecten tegelijk te dragen!",
               emptyBag: "De robot probeert een object neer te leggen terwijl hij er geen draagt!",
               successReachExit: "Gefeliciteerd, je robot heeft de uitgang bereikt!",
               failureReachExit: "Je robot heeft de uitgang niet bereikt.",
               successPickedAllWithdrawables: "Gefeliciteerd, je robot heeft alles opgeraapt!",
               failurePickedAllWithdrawables: "Je robot heeft niet alles opgeraapt.",
               successContainersFilled: "Gefeliciteerd, je robot heeft elke container gevuld",
               failureContainersFilled: "Er ligt een object buiten de containers",
               failureContainersFilledLess: "Je robot heeft niet elke container gevuld",
               failureContainersFilledBag: "Je robot heeft niet alle objecten neergelegd",
               failureUnfilteredObject: "Je robot heeft een ongeldig object opgeraapt",
               failureTooManyMoves: "Je robot heeft te veel verplaatsingen gedaan.",
               failureWriteHere: "Je robot kan hier niet schrijven!",
               failureReadHere: "Er staat hier geen nummer!",
               successNumbersWritten: "Gefeliciteerd, je robot heeft alle juiste nummers geschreven!",
               failureNumbersWritten: "Je robot heeft niet de juiste nummers geschreven!",
               failureMissingNumber: "De robot heeft niet alle nummers geschreven.",
               failureNothingToPush: "Er is geen object om te duwen!",
               failureWhilePushing: "De robot kan dit object niet duwen!",
               failureDropObject: "Je kunt hier geen object neerleggen",
               failureDropPlatform: "Er is hier al een platform",
               failureDropWater: "Er is hier al water",
               failureDropToken: "Er is hier al een fiche",
               failureDropOutside: "Je robot probeert een object buiten het rooster neer te leggen",
               failureNotEnoughPlatform: "Niet genoeg platforms",
               failureLights: "Er blijven nog lampen aan te steken.",
               successLights: "Gefeliciteerd, je robot heeft alle lampen aangezet!",
               failureLaser: "De robot moet op een laserlanceerder staan om te kunnen schieten!",
               failureNoPlug: "De robot moet op een stekker staan om een kabel aan te sluiten!",
               failureAlreadyWired: "Deze stekker is al verbonden met een kabel!",
               failureWrongPlugType: "Je kunt deze stekkers niet met elkaar verbinden!",
               successPlugsWired: "De machine is hersteld!",
               failurePlugsWired: "De machine werkt niet omdat sommige stekkers niet zijn aangesloten!",
               failureWireCrossing: "Onmogelijk om deze twee stekkers te verbinden: twee kabels zouden elkaar kruisen!",
               failureWireTooLong: "Onmogelijk om deze twee stekkers te verbinden: ze liggen te ver uit elkaar!",
               failureTotalLengthExceeded: "Je hebt niet genoeg kabellengte om deze twee stekkers te verbinden!",
               failureProjectile: "De robot is geraakt door een projectiel!",
               failureRewrite: "De robot probeerde een vakje opnieuw te kleuren.",
               noContainer: "Er is hier geen container!",
               failureLineBreak: "De robot kan niet van rij veranderen.",
               failureFuse: "De robot heeft op een zekering geschoten!"
            },
            cardinals: {
               north: "Noord",
               south: "Zuid",
               west: "West",
               east: "Oost"
            },
            startingBlockName: "Programma van de robot"
         },
         
         es: {
            label: {
               row: "fila del robot",
               col: "columna del robot",
               north: "avanzar hacia arriba",
               south: "avanzar hacia abajo",
               east: "avanzar hacia la derecha",
               west: "avanzar hacia la izquierda",
               left: "girar a la izquierda",
               right: "girar a la derecha",
               turnAround: "dar media vuelta",
               forward: "avanzar",
               backwards: "retroceder",
               jump: "saltar",
               obstacleInFront: "obstáculo adelante",
               obstacleEast: "obstáculo a la derecha",
               obstacleWest: "obstáculo a la izquierda",
               obstacleNorth: "obstáculo arriba",
               obstacleSouth: "obstáculo abajo",
               obstacleRight: "obstáculo a la derecha",
               obstacleLeft: "obstáculo a la izquierda",
               gridEdgeEast: "borde de la cuadrícula a la derecha",
               gridEdgeWest: "borde de la cuadrícula a la izquierda",
               gridEdgeNorth: "borde de la cuadrícula arriba",
               gridEdgeSouth: "borde de la cuadrícula abajo",
               platformInFront: "plataforma adelante",
               platformAbove: "plataforma arriba",
               withdrawObject: "recoger el objeto",
               dropObject: "soltar el objeto",
               onObject: "sobre un objeto",
               onContainer: "sobre un contenedor",
               onNumber: "sobre un número",
               onWritable: "sobre un cuadro",
               onLauncher: "sobre un lanzador láser",
               writeNumber: "escribir el número",
               readNumber: "número en la casilla",
               pushObject: "empujar el objeto",
               pushableInFront: "objeto empujable adelante",
               shoot: "disparar el láser en la dirección %1",
               shoot_noShadow: "disparar el laser en la dirección %1",
               shootCondition: "dirección del tiro de retorno %1",
               shootCondition_noShadow: "dirección del tiro de retorno %1",
               dropPlatformInFront: "construir una plataforma adelante",
               dropPlatformAbove: "construir una plataforma arriba"
            },
            code: {
               row: "filaRobot",
               col: "columnaRobot",
               north: "arriba",
               south: "abajo",
               east: "derecha",
               west: "izquierda",
               left: "girarIzquierda",
               right: "girarDerecha",
               turnAround: "mediaVuelta",
               forward: "avanzar",
               backwards: "retroceder",
               jump: "saltar",
               obstacleInFront: "obstaculoAdelante",
               obstacleRight: "obstaculoDerechaRel",
               obstacleLeft: "obstaculoIzquierdaRel",
               obstacleEast: "obstaculoDerecha",
               obstacleWest: "obstaculoIzquierda",
               obstacleNorth: "obstaculoArriba",
               obstacleSouth: "obstaculoAbajo",
               gridEdgeEast: "bordeCuadriculaDerecha",
               gridEdgeWest: "bordeCuadriculaIzquierda",
               gridEdgeNorth: "bordeCuadriculaArriba",
               gridEdgeSouth: "bordeCuadriculaAbajo",
               platformInFront: "plataformaAdelante",
               platformAbove: "plataformaArriba",
               withdrawObject: "recogerObjeto",
               dropObject: "soltarObjeto",
               onObject: "sobreObjeto",
               onContainer: "sobreContenedor",
               onNumber: "sobreNumero",
               onWritable: "sobreCuadro",
               onLauncher: "sobreLanzador",
               writeNumber: "escribirNumero",
               readNumber: "leerNumero",
               pushObject: "empujarObjeto",
               pushableInFront: "empujableAdelante",
               shoot: "dispararLaser",
               shoot_noShadow: "dispararLaser",
               shootCondition: "condicionDisparo",
               shootCondition_noShadow: "condicionDisparo",
               dropPlatformInFront: "construirPlataformaAdelante",
               dropPlatformAbove: "construirPlataformaArriba"
            },
            messages: {
               leavesGrid: "¡El robot salió de la cuadrícula!",
               obstacle: "¡El robot intenta moverse sobre un obstáculo!",
               nothingToPickUp: "No hay algo para recoger",
               nothingToLookAt: "No hay carta ni contenedor en esta casilla",
               falls: "¡El robot va a caer al vacío!",
               willFallAndCrash: "¡El robot va a caer y chocar!",
               jumpOutsideGrid: "¡El robot intenta saltar fuera de la cuadrícula!",
               jumpObstacleBlocking: "El robot intenta saltar pero hay un obstáculo que lo bloquea",
               jumpNoPlatform: "¡El robot intenta saltar pero no hay una plataforma arriba!",
               tooManyObjects: "¡El robot intenta transportar demasiados objetos al mismo tiempo!",
               emptyBag: "El robot intenta soltar un objeto, ¡pero no carga nada!",
               successReachExit: "Bravo, ¡su robot a llegado a la salida!",
               failureReachExit: "Su robot no ha llegado a la salida.",
               successPickedAllWithdrawables: "Bravo, su robot ha recogido todo!",
               failurePickedAllWithdrawables: "Su robot no ha recogido todo.",
               successContainersFilled: "Bravo, su robot ha llenado todos los contenedores",
               failureContainersFilled: "Hay un objeto fuera de los contenedores",
               failureContainersFilledLess: "Su robot no ha llenado todos los contenedores",
               failureContainersFilledBag: "Su robot no ha puesto todos los objetos",
               failureUnfilteredObject: "Su robot ha recogido un objeto inválido",
               failureTooManyMoves: "Su robot ha realizado demasiados desplazamientos.",
               failureWriteHere: "¡Su robot no puede escribir aquí!",
               failureNothingToWrite: "Der Roboter hat nichts, was er schreiben soll.", //TODO
               failureReadHere: "¡No hay un número aquí!",
               successNumbersWritten: "Bravo, su robot ha escrito los números correctos!",
               failureNumbersWritten: "Su robot no ha escrito los números correctos!",
               failureNothingToPush: "¡No hay un objeto que empujar!",
               failureWhilePushing: "¡El robot no puede empujar este objeto!",
               failureDropObject: "No es posible poner el objeto aquí",
               failureDropPlatform: "No es posible poner el objeto aquí",
               failureDropOutside: "Su robot intenta poner un objeto fuera de la cuadrícula",
               failureNotEnoughPlatform: "No hay suficiente plataforma",
               failureLights: "Aún faltan lugares que iluminar.",
               successLights: "Bravo, ¡su robot ha iluminado todos los lugares!",
               failureLaser: "¡El robot debe encontrarse sobre una terminal láser para poder disparar!"
            },
            cardinals: {
               north: "Norte",
               south: "Sur",
               west: "Oeste",
               east: "Este"
            },
            startingBlockName: "Programa del robot"
         },
         de: {
            label: {
               row: "Zeile des Roboters",
               col: "Spalte des Roboters",
               wait: "warte",
               north: "gehe nach oben",
               south: "gehe nach unten",
               east: "gehe nach rechts",
               west: "gehe nach links",
               left: "drehe nach links",
               right: "drehe nach rechts",
               turnAround: "drehe um",
               forward: "gehe vorwärts",
               backwards: "gehe rückwärts",
               jump: "spring hoch",
               obstacleInFront: "vor Hindernis",
               obstacleEast: "Hindernis rechts",
               obstacleWest: "Hindernis links",
               obstacleNorth: "Hindernis oben",
               obstacleSouth: "Hindernis unten",
               obstacleRight: "Hindernis rechts",
               obstacleLeft: "Hindernis links",
               gridEdgeNorth: "Gitterrand oben",
               gridEdgeSouth: "Gitterrand unten",
               gridEdgeEast: "Gitterrand rechts",
               gridEdgeWest: "Gitterrand links",
               platformInFront: "Plattform vorne",
               platformAbove: "Plattform oben",
               withdrawObject: "hebe Objekt auf",
               dropObject: "lege Objekt ab",
               onObject: "auf Objekt",
               onContainer: "auf Behälter",
               onNumber: "auf Zahl",
               onWritable: "auf Tafel",
               onLauncher: "auf Laser", //Check this!
               writeNumber: "schreibe Zahl",
               readNumber: "lies Zahl",
               pushObject: "schiebe Objekt",
               pushableInFront: "vor beweglichen Objekt",
               dropNum: "lasse %1 Objekte fallen",
               dropNum_noShadow: "lasse %1 Objekte fallen",
               nbWithdrawables: "Anzahl der Objekte auf dem Platz",
               nbInBag: "Anzahl der Objekte in der Tasche",
               containerSize: "Anzahl der Objekte, die auf dem Feld platziert werden sollen", //Check this!
               withdrawNum: "nimm %1 Objekte",
               withdrawNum_noShadow: "nimm %1 Objekte",
               shoot: "richte Laserstrahl aus nach %1",
               shoot_noShadow: "richte Laserstrahl aus nach %1",
               shootCondition: "Rückkehr von der Schießrichtung %1",
               shootCondition_noShadow: "Rückkehr von der Schießrichtung %1",
               connect: "ein Kabel anschließen",
               onMale: "auf Stecker",
               onFemale: "auf Dose",
               dropPlatformInFront: "baue eine Plattform vorne",
               dropPlatformAbove: "baue eine Plattform oben"
               
            },
            code: {
               row: "zeileRoboter",
               col: "spalteRoboter",
               wait: "warte",
               north: "oben",
               south: "unten",
               east: "rechts",
               west: "links",
               left: "dreheLinks",
               right: "dreheRechts",
               turnAround: "dreheUm",
               forward: "vorwaerts",
               backwards: "rueckwaerts",
               jump: "spring",
               obstacleInFront: "vorHindernis",
               obstacleEast: "hindernisRechts",
               obstacleWest: "hindernisLinks",
               obstacleNorth: "hindernisOben",
               obstacleSouth: "hindernisUnten",
               obstacleRight: "hindernisRechtsRelativ", //Check Unterschied hier!
               obstacleLeft: "hindernisLinksRelativ",
               gridEdgeEast: "gitterrandRechts",
               gridEdgeWest: "gitterrandLinks",
               gridEdgeNorth: "gitterrandOben",
               gridEdgeSouth: "gitterrandUnten",
               platformInFront: "plattformVorne",
               platformAbove: "plattformOben",
               withdrawObject: "hebeObjektAuf",
               dropObject: "legeObjektAb",
               onObject: "aufObject",
               onContainer: "aufBehaelter",
               onNumber: "aufZahl",
               onWritable: "aufTafel",
               onLauncher: "aufLauncher", 
               writeNumber: "schreibeZahl",
               readNumber: "leseZahl",
               pushObject: "schiebeObjekt",
               pushableInFront: "vorBeweglichenObject",
               dropNum: "legeAb",
               dropNum_noShadow: "legeAb",
               containerSize: "anzahlObjektePlatzieren",
               nbInBag: "anzahlObjekteinTasche",
               nbWithdrawables: "anzahlObjekteAnPlatz",
               withdrawNum: "nimmObjekte",
               withdrawNum_noShadow: "nimmObjekte",
               shoot: "richteLaserstrahlAus",
               shoot_noShadow: "richteLaserstrahlAus",
               shootCondition: "richteLaserstrahlWenn",
               shootCondition_noShadow: "richteLaserstrahlWenn",
               connect: "anschliessen",
               onMale: "aufStecker",
               onFemale: "aufSteckdose",
               dropPlatformInFront: "bauePlattformVorne",
               dropPlatformAbove: "bauePlattformOben"
            },
            messages: {
               leavesGrid: "Der Roboter hat das Gitter verlassen!",
               obstacle: "Der Roboter ist gegen ein Hindernis gelaufen!",
               nothingToPickUp: "An dieser Stelle gibt es nichts zum Aufheben!",
               nothingToLookAt: "An dieser Stelle gibt es nichts zum Betrachten!",
               falls: "Achtung! Der Roboter würde in den Abgrund fallen!",
               willFallAndCrash: "Der Roboter würde hier runterfallen und kaputt gehen!",
               jumpOutsideGrid: "Der Roboter versucht, aus dem Gitter zu springen!",
               jumpObstacleBlocking: "Der Roboter kann hier nicht springen, weil ein Hindernis ihn blockiert.",
               jumpNoPlatform: "Der Roboter kann hier nicht springen, weil über ihm keine Plattform ist.",
               tooManyObjects: "Der Roboter kann nicht so viele Objekte auf einmal tragen!",
               emptyBag: "Der Roboter kann nichts ablegen, weil er gar nichts transportiert!",
               successReachExit: "Bravo! Der Roboter hat den Ausgang erreicht.",
               failureReachExit: "Der Roboter hat den Ausgang nicht erreich!",
               successPickedAllWithdrawables: "Bravo! Der Roboter hat alles eingesammelt.",
               failurePickedAllWithdrawables: "Der Roboter hat nicht alles eingesammelt!",
               successContainersFilled: "Gut gemacht! Der Roboter hat alle Behälter gefüllt.",
               failureContainersFilled: "Es befindet sich ein Objekt außerhalb der Behälter.",
               failureContainersFilledLess: "Der Roboter hat nicht alle Kegel platziert.",
               failureContainersFilledBag: "Der Roboter hat nicht alle Objekte platziert.",
               failureUnfilteredObject: "Der Roboter hat ein nicht erlaubtes Objekt aufgehoben!",
               failureTooManyMoves: "Der Roboter hat zu viele Züge gemacht.",
               failureWriteHere: "Der Roboter kann an dieser Stelle nicht schreiben!",
               failureNothingToWrite: "Der Roboter hat nichts, was er schreiben soll.",
               failureReadHere: "An dieser Stelle steht keine Zahl!",
               successNumbersWritten: "Bravo! Der Roboter hat die richtigen Zahlen geschrieben.",
               failureNumbersWritten: "Der Roboter hat nicht die richtigen Zahlen geschrieben!",
               failureNothingToPush: "An dieser Stelle gibt es nichts zum Schieben!",
               failureWhilePushing: "Der Roboter hat es nicht geschafft, das Objekt zu schieben!",
               failureDropObject: "An dieser Stelle kann kein Objekt abgelegt werden!",
               failureDropPlatform: "An dieser Stelle kann keine Plattform gebaut werden!",
               failureDropOutside: "Der Roboter versucht ein Objekt vom Gitterrand zu schieben!",
               failureNotEnoughPlatform: "Nicht genügend Plattformen!",
               failureLights: "Der Roboter hat nicht alles beleuchtet!",
               successLights: "Bravo! Der Roboter hat alles beleuchtet.",
               failureLaser: "Der Roboter muss auf einem Laser stehen, um den Laserstrahl zu aktivieren!",
               failureDirection: "Der Laser kann nur in ganzzahlige Richtungen schießen.",
               failureNoPlug: "Der Roboter muss an einem Anschluss stehen, um ein Kabel anschließen zu können!",
               failureAlreadyWired: "Dieser Anschluss ist bereits mit einem Kabel verbunden!",
               failureWrongPlugType: "Diese Anschlüsse können nicht miteinander verbunden werden!",
               successPlugsWired: "Die Maschine ist repariert!",
               failurePlugsWired: "Die Maschine funktioniert nicht, da Anschlüsse nicht verbunden wurden!",
               failureWireCrossing: "Diese beiden Anschlüsse können nicht verbunden werden, da sich die Kabel kreuzen würden!",
               failureWireTooLong: "Diese beiden Anschlüsse können nicht verbunden werden, da sie zu weit voneinander entfernt sind!",
               failureTotalLengthExceeded: "Die Kabellänge reicht nicht aus, um diese beiden Anschlüsse zu verbinden!",
            },
            cardinals: {
               north: "Norden",
               south: "Süden",
               west: "Westen",
               east: "Osten"
            },
            startingBlockName: "Roboter-Programm"
         },
         it: {
            label: {
               row: "ligne du robot",
               col: "colonne du robot",
               wait: "attendre",
               north: "andare avanti",
               south: "avanzare verso il basso",
               east: "avanza a destra",
               west: "avancer vers la gauche",
               left: "tourner à gauche",
               right: "tourner à droite",
               turnAround: "faire demi-tour",
               forward: "avancer",
               backwards: "reculer",
               jump: "sauter",
               obstacleInFront: "obstacle devant",
               obstacleEast: "obstacle à droite",
               obstacleWest: "obstacle à gauche",
               obstacleNorth: "obstacle en haut",
               obstacleSouth: "obstacle en bas",
               obstacleRight: "obstacle à droite",
               obstacleLeft: "obstacle à gauche",
               gridEdgeEast: "bord de la grille à droite",
               gridEdgeWest: "bord de la grille à gauche",
               gridEdgeNorth: "bord de la grille en haut",
               gridEdgeSouth: "bord de la grille en bas",
               platformInFront: "plateforme devant",
               platformAbove: "plateforme au-dessus",
               withdrawObject: "ramasser l'objet",
               dropObject: "dipingi la scatola",
               onObject: "su un marmo",
               onContainer: "su un buco",
               onNumber: "sur un nombre",
               onWritable: "sur un tableau",
               onLauncher: "sur un lanceur laser",
               writeNumber: "scrivere numero",
               readNumber: "numero sulla casella",
               pushObject: "pousser l'objet",
               pushableInFront: "poussable devant",
               shoot: "tirer au laser dans la direction %1",
               shoot_noShadow: "tirer au laser dans la direction %1",
               shootCondition: "retour départ tir direction %1",
               shootCondition_noShadow: "retour départ tir direction %1",
               connect: "brancher un câble",
               onMale: "sur une prise mâle",
               onFemale: "sur une prise femelle"
            },
            code: {
               row: "ligneRobot",
               col: "colonneRobot",
               wait: "attendre",
               north: "haut",
               south: "bas",
               east: "droite",
               west: "gauche",
               left: "tournerGauche",
               right: "tournerDroite",
               turnAround: "demiTour",
               forward: "avancer",
               backwards: "reculer",
               jump: "sauter",
               obstacleInFront: "obstacleDevant",
               obstacleEast: "obstacleDroite",
               obstacleWest: "obstacleGauche",
               obstacleNorth: "obstacleHaut",
               obstacleSouth: "obstacleBas",
               obstacleRight: "obstacleDroiteRel",
               obstacleLeft: "obstacleGaucheRel",
               gridEdgeEast: "bordGrilleDroite",
               gridEdgeWest: "bordGrilleGauche",
               gridEdgeNorth: "bordGrilleHaut",
               gridEdgeSouth: "bordGrilleBas",
               platformInFront: "plateformeDevant",
               platformAbove: "plateformeDessus",
               withdrawObject: "ramasserObjet",
               dropObject: "deposerObjet",
               onObject: "surObjet",
               onContainer: "surConteneur",
               onNumber: "surNombre",
               onWritable: "surTableau",
               onLauncher: "surLanceur",
               writeNumber: "ecrireNombre",
               readNumber: "nombreSurCase",
               pushObject: "pousserObjet",
               pushableInFront: "poussableDevant",
               shoot: "tirerLaser",
               shoot_noShadow: "tirerLaser",
               shootCondition: "tirerCondition",
               shootCondition_noShadow: "tirerCondition",
               connect: "brancherCable",
               onMale: "surMale",
               onFemale: "surFemelle"
            },
            messages: {
               leavesGrid: "Le robot sort de la grille !",
               obstacle: "Le robot essaie de se déplacer sur un obstacle !",
               nothingToPickUp: "Il n'y a rien à ramasser !",
               nothingToLookAt: "Il n'y a ni carte ni conteneur sur cette case",
               falls: "Le robot va se jeter dans le vide !",
               willFallAndCrash: "Le robot va tomber de haut et s'écraser !",
               jumpOutsideGrid: "Le robot essaie de sauter en dehors de la grille !",
               jumpObstacleBlocking: "Le robot essaie de sauter mais il y a un obstacle qui le bloque",
               jumpNoPlatform: "Le robot essaie de sauter mais il n'y a pas de plateforme au dessus !",
               tooManyObjects: "Le robot essaie de transporter trop d'objets à la fois !",
               emptyBag: "Le robot essaie de déposer un objet alors qu'il n'en transporte pas !",
               successReachExit: "Bravo, votre robot a atteint la sortie !",
               failureReachExit: "Votre robot n'a pas atteint la sortie.",
               successPickedAllWithdrawables: "Bravo, votre robot a tout ramassé !",
               failurePickedAllWithdrawables: "Votre robot n'a pas tout ramassé.",
               successContainersFilled: "Bravo, votre robot a rempli tous les conteneurs",
               failureContainersFilled: "Il y a un objet hors des conteneurs",
               failureContainersFilledLess: "Votre robot n'a pas rempli tous les conteneurs",
               failureContainersFilledBag: "Votre robot n'a pas posé tous les objets",
               failureUnfilteredObject: "Votre robot a ramassé un objet invalide",
               failureTooManyMoves: "Votre robot a effectué trop de déplacements.",
               failureWriteHere: "Votre robot ne peut pas écrire ici !",
               failureNothingToWrite: "Der Roboter hat nichts, was er schreiben soll.", //TODO
               failureReadHere: "Il n'y a pas de nombre écrit ici !",
               successNumbersWritten: "Bravo, votre robot a écrit les bons nombres !",
               failureNumbersWritten: "Votre robot n'a pas écrit les bons nombres !",
               failureNothingToPush: "Il n'y a pas d'objet à pousser !",
               failureWhilePushing: "Le robot ne peut pas pousser cet objet !",
               failureDropObject: "On ne peut pas poser d'objet ici",
               failureDropPlatform: "On ne peut pas construire de plateforme ici",
               failureDropOutside: "Votre robot essaie de poser un objet hors de la grille",
               failureNotEnoughPlatform: "Pas assez de plateformes",
               failureLights: "Il reste des spots à allumer.",
               successLights: "Bravo, votre robot a allumé tous les spots !",
               failureLaser: "Le robot doit se trouver sur une borne laser pour pouvoir tirer !",
               failureNoPlug: "Le robot doit se trouver sur une prise pour pouvoir brancher un câble !",
               failureAlreadyWired: "Cette prise est déjà connectée à un câble !",
               failureWrongPlugType: "On ne peut pas connecter ces prises ensemble !",
               successPlugsWired: "La machine est réparée !",
               failurePlugsWired: "La machine ne fonctionne pas car des prises n'ont pas été connectées !",
               failureWireCrossing: "Impossible de relier ces deux prises, deux câbles vont s'intersecter !",
               failureWireTooLong: "Impossible de relier ces deux prises car elles sont trop éloignées !",
               failureTotalLengthExceeded: "Vous n'avez pas assez de longueur de câble pour relier ces deux prises !",
               failureProjectile: "Le robot s'est pris un projectile !",
               failureRewrite: "Le robot a essayé de repeindre une case."
            },
            cardinals: {
               north: "Nord",
               south: "Sud",
               west: "Ovest",
               east: "Est"
            },
            startingBlockName: "Programme du robot"
         },
      },
      labyrinth: {
         fr: {
            messages: {
               successReachExit: "Bravo, le robot a atteint la case verte !",
               failureReachExit: "Le robot n'est pas arrivé sur la case verte.",
               obstacle: "Le robot tente de foncer dans un mur !"
            }
         },
         en: {
            messages: {
               successReachExit: "Congratulations, the robot reached the green cell!",
               failureReachExit: "The robot didn't reach the green cell.",
               obstacle: "The robot is attempting to run into a wall!"
            }
         },
         de: {
            messages: {
               obstacle: "Der Roboter ist gegen ein Hindernis gefahren.",
               successReachExit: "Gratulation, der Roboter hat den Ausgang gefunden!",
               failureReachExit: "Der Roboter ist immer noch im Labyrinth. Er muss den Ausgang finden."
            }
         }, 
      },
      arrows: {
         fr: {
            messages: {
               obstacle: "Le robot va sortir du parcours fléché !",
               successReachExit: "Bravo, votre robot a récupéré le coffre !",
               failureReachExit: "Votre robot s'est perdu en chemin."
            }
         },
         en: {
            messages: {
               obstacle: "The robot will get out of the marked track!",
               successReachExit: "Congratulations, your robot collected the safe!",
               failureReachExit: "Yout robot got lost."
            }
         },
         nl: {
            messages: {
               obstacle: "De robot gaat het gemarkeerde parcours verlaten!",
               successReachExit: "Bravo, je robot heeft de kist opgehaald!",
               failureReachExit: "Je robot is onderweg verdwaald."
            }
         },

         es: {
            messages: {
               obstacle: "¡El robot va a salirse del camino marcado!",
               successReachExit: "Bravo, ¡su robot ha recuperado el cofre!",
               failureReachExit: "Su robot se perdió en el camino."
            }
         },
         de: {
            label: {
               dropObject: "färbe Feld",
               onContainer: "auf Markierung",
             },
             code : {
               dropObject: "faerbeFeld",
               onContainer: "aufMarkierung",             
             },
            messages: {
               obstacle: "Der Roboter verlässt den Weg, den die Pfeile vorgeben!",
               successReachExit: "Gratulation, der Roboter hat den Schatz geborgen!",
               failureReachExit: "Der Roboter muss am Ende auf der Schatztruhe stehen."
            }
         },  
      },
      arrows_straight: {
         de: {
            label: {
               dropObject: "färbe Feld",
               onContainer: "auf Markierung",
             },
             code : {
               dropObject: "faerbeFeld",
               onContainer: "aufMarkierung",             
             },
            messages: {
               obstacle: "Der Roboter ist gegen ein Hindernis gelaufen!",
               successReachExit: "Gratulation, der Roboter hat den Schatz geborgen!",
               failureReachExit: "Der Roboter muss am Ende auf der Schatztruhe stehen."
            }
         },  
      },
      gears: {
         de:
          {
            label: {
               withdrawObject: "hebe Zahnrad auf",
               dropObject: "baue Zahnrad ein",
               onObject: "auf Zahnrad", //auf Zahnrad?
               onContainer: "auf Maschine"
            },
            code: {
               withdrawObject: "hebeZahnradAuf",
               dropObject: "baueZahnradEin",
               onObject: "aufZahnrad",
               onContainer: "aufMaschine"
            },
            messages: {
               successContainersFilled: "Gut gemacht, die Maschinen sind startklar!",
               failureContainersFilled: "Der Roboter hat nicht alle Zahnräder an der richtigen Stelle eingesetzt.",
               failureContainersFilledLess: "Der Roboter hat nicht alle Zahnrädereingesetzt.",
               failureContainersFilledBag: "Der Roboter muss alle Zahnräder in die Maschine einbauen.",
               failureDropOutside: "Der Roboter kann hier kein Zahnrad einbauen.",
               failureDropObject: "Diese Maschine benötigt kein weiteres Zahnrad",
               emptyBag: "Der Roboter hat kein Zahnrad bei sich, welches er einbauen könnte.",
               tooManyObjects: "Der Roboter kann nicht so viele Zahnräder auf einmal tragen!",
            }
          }
      },
      cards: {
         fr: {
            label: {
               withdrawObject: "ramasser la carte",
               dropObject: "déposer la carte",
               onObject: "sur une carte",
               onContainer: "sur un emplacement de dépôt",
            },
             messages: {
               successContainersFilled: "Bravo, votre robot a rangé les cartes au bon endroit !",
               successContainersFilledSingular: "Bravo, votre robot a rangé la carte au bon endroit !",
               failureContainersFilled: "Il y a des cartes mal rangées",
               failureContainersFilledLess: "Il y a encore des cartes à ranger.",
               failureContainersFilledBag: "Votre robot doit déposer sa carte."
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the card",
               dropObject: "drop the card",
               onObject: "on a card",
               onContainer: "on a placeholder",
            },
             messages: {
               successContainersFilled: "Congratulations, your robot placed all the cards at the right location!",
               failureContainersFilled: "Some cards are misplaced",
               failureContainersFilledLess: "There are still misplaced cards.",
               failureContainersFilledBag: "Your robot must drop its card."
            }
         },
         nl: {
            label: {
               withdrawObject: "de kaart oprapen",
               dropObject: "de kaart neerleggen",
               onObject: "op een kaart",
               onContainer: "op een neerlegplaats",
            },
             messages: {
               successContainersFilled: "Bravo, je robot heeft de kaarten op de juiste plaats gelegd!",
               successContainersFilledSingular: "Bravo, je robot heeft de kaart op de juiste plaats gelegd!",
               failureContainersFilled: "Er liggen kaarten verkeerd",
               failureContainersFilledLess: "Er zijn nog kaarten om op te bergen.",
               failureContainersFilledBag: "Je robot moet zijn kaart neerleggen."
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la carta",
               dropObject: "soltar la carta",
               onObject: "sobre una carta",
               onContainer: "en un sitio de depósito",
            },
             messages: {
               successContainersFilled: "Bravo, su robot ha ordenado las cartas en un buen lugar!",
               failureContainersFilled: "Hay cartas ordenadas incorrectamente.",
               failureContainersFilledLess: "Aún quedan cartas sin ordenar.",
               failureContainersFilledBag: "Su robot debe depositar su carta."
            }
         },
         de: {
            label: {
               withdrawObject: "hebe Karte auf",
               dropObject: "lege Karte ab",
               onObject: "auf Karte",
               onContainer: "auf Ablageplatz",
            },
            code: {
               withdrawObject: "hebeKarteAuf",
               dropObject: "legeKarteAb",
               onObject: "aufKarte",
               onContainer: "aufAblageplatz",
            },
             messages: {
               successContainersFilled: "Bravo, der Roboter hat alle Karten an ihre Plätze sortiert!",
               successContainersFilledSingular: "Bravo, dein Roboter hat die Karte am richtigen Ort abgelegt!",
               failureContainersFilled: "Einige Karten sind nicht richtig einsortiert.",
               failureContainersFilledLess: "Es gibt noch falsch einsortierte Karten.",
               failureContainersFilledBag: "Der Roboter muss seine Karten ablegen."
            }
         },
      },
      castle: {
         fr: {
            label: {
               withdrawObject: "ramasser le bois",
               dropObject: "déposer le bois",
               onObject: "sur du bois",
               onContainer: "sur une cheminée"
            },
            code: {
               withdrawObject: "ramasserBois",
               dropObject: "deposerBois",
               onObject: "surBois",
               onContainer: "surCheminee"
            },
            messages: {
               successContainersFilled: "Bravo, le château est bien chauffé !",
               successContainersFilledSingular: "Bravo, il y a un bon feu dans la cheminée !",
               failureContainersFilled: "Votre robot n'a pas mis du bois dans toutes les cheminées.",
               failureContainersFilledSingular: "Votre robot n'a pas mis le bois dans la cheminée.",
               failureContainersFilledLess: "Votre robot n'a pas mis du bois dans toutes les cheminées..",
               failureContainersFilledLessSingular: "Votre robot n'a pas mis le bois dans la cheminée.",
               failureContainersFilledBag: "Votre robot doit déposer le bois dans la cheminée.",
               failureDropOutside: "Votre robot essaie de construire une plateforme hors de la grille.",
               failureDropObject: "Le robot essaie de déploser du bois alors qu'il y en a déjà dans cette cheminée !",
               failureDropPlatform: "Il y a déjà une plateforme ici !",
               emptyBag: "Le robot essaie de déposer du bois alors qu'il n'en transporte pas !",
               tooManyObjects: "Le robot essaie de transporter trop de bois à la fois !"
            }
         },

         en: {
            label: {
               withdrawObject: "pick up the gear",
               dropObject: "accrocher la roue dentée",
               onObject: "sur une roue dentée",
               onContainer: "sur une machine"
            },
            code: {
               withdrawObject: "pickGear",
               dropObject: "attachGear",
               onObject: "onGear",
               onContainer: "onMachine"
            },
            messages: {
               successContainersFilled: "Bravo, les machines sont prêtes à fonctionner !",
               failureContainersFilled: "Votre robot n'a pas replacé toutes les roues dentées au bon endroit.",
               failureContainersFilledLess: "Votre robot n'a pas replacé toutes les roues dentées au bon endroit.",
               failureContainersFilledBag: "Votre robot doit déposer la roue dentée sur la machine.",
               failureDropOutside: "Votre robot essaie de construire une plateforme hors de la grille.",
               failureDropObject: "Il y a déjà une plateforme ici !",
               failureDropPlatform: "Il y a déjà une plateforme ici !",
               emptyBag: "Le robot essaie d'accrocher une roue dentée alors qu'il n'en transporte pas !"
            }
         },
         nl: {
            label: {
               withdrawObject: "het hout oprapen",
               dropObject: "het hout neerleggen",
               onObject: "op hout",
               onContainer: "op een schoorsteen"
            },
            code: {
               withdrawObject: "raapHoutOp",
               dropObject: "legHoutNeer",
               onObject: "opHout",
               onContainer: "opSchoorsteen"
            },
            messages: {
               successContainersFilled: "Bravo, het kasteel is goed verwarmd!",
               successContainersFilledSingular: "Bravo, er brandt een goed vuur in de schoorsteen!",
               failureContainersFilled: "Je robot heeft niet in alle schoorstenen hout gelegd.",
               failureContainersFilledSingular: "Je robot heeft het hout niet in de schoorsteen gelegd.",
               failureContainersFilledLess: "Je robot heeft niet in alle schoorstenen hout gelegd.",
               failureContainersFilledLessSingular: "Je robot heeft het hout niet in de schoorsteen gelegd.",
               failureContainersFilledBag: "Je robot moet het hout in de schoorsteen leggen.",
               failureDropOutside: "Je robot probeert een platform buiten het rooster te bouwen.",
               failureDropObject: "De robot probeert hout neer te leggen terwijl er al hout in deze schoorsteen ligt!",
               failureDropPlatform: "Er is hier al een platform!",
               emptyBag: "De robot probeert hout neer te leggen terwijl hij er geen draagt!",
               tooManyObjects: "De robot probeert te veel hout tegelijk te dragen!"
            }
         },

         es: {
            label: {
               withdrawObject: "recoger el engranaje",
               dropObject: "soltar el engranaje",
               onObject: "sobre engranaje",
               onContainer: "sobre una máquina"
            },
            code: {
               withdrawObject: "recogerEngranaje",
               dropObject: "soltarEngranaje",
               onObject: "sobreEngranaje",
               onContainer: "sobreMaquina"
            },
            messages: {
               successContainersFilled: "Bravo, ¡la máquina está lista para funcionar!",
               failureContainersFilled: "Su robot no ha puesto todos los engranajes en el lugar correcto.",
               failureContainersFilledLess: "Su robot no ha puesto todos los engranajes en el lugar correcto.",
               failureContainersFilledBag: "Su robot debe colocar el engranaje en la máquina.",
               failureDropOutside: "Su robot intenta construir una plataforma fuera de la cuadrícula."
            } 
         },
         de: {
            label: {
               withdrawObject: "Holzstapel einsammeln",
               dropObject: "Holzstapel ablegen",
               onObject: "auf Holzstapel",
               onContainer: "beim Kamin"
            },
            code: {
               withdrawObject: "holzEinsammeln",
               dropObject: "holzAblegen",
               onObject: "aufHolz",
               onContainer: "beimKamin"
            },
            // description: {
            //    withdrawObject: "holzEinsammeln() sammelt alles Holz auf dem Feld",
            //    dropObject: "holzAblegen() legt einen Holzscheit auf dem Feld ab",
            //    onObject: "aufHolz() zeigt an, ob sich Holz auf dem Feld befindet",
            //    onContainer: "beimKamin() zeigt an, ob sich ein Kamin auf dem Feld befindet",
            // },
            messages: {
               successContainersFilled: "Bravo, das Schloss wird gut beheizt!",
               successContainersFilledSingular: "Bravo, im Kamin brennt ein gutes Feuer!",
               failureContainersFilled: "Der Roboter hat nicht alle Kamine mit Holz gefüllt.",
               failureContainersFilledSingular: "Dein Roboter hat das Holz nicht in den Kamin gelegt.",
               failureContainersFilledLess: "Der Roboter hat nicht alle Kamine mit Holz gefüllt.",
               failureContainersFilledLessSingular: "Dein Roboter hat das Holz nicht in den Kamin gelegt.",
               failureContainersFilledBag: "Der Roboter soll das Holz in die Kamine legen.",
               failureDropOutside: "Der Roboter versucht eine Plattform außerhalb des Gitters zu bauen.",
               failureDropObject: "In diesem Kamin ist bereits Holz.",
               emptyBag: "Der Roboter trägt kein Holz, das er hier ablegen könnte.",
            }
         },
      },
      chticode_abs: {
         fr: {
            label: {
               
            },
             messages: {
               successPickedAllWithdrawables: "Bravo, votre robot a réussi la mission !",
               failureReachExit: "Votre robot n'a pas atteint la case verte."
            }
         },
         en: {
            label: {
               
            },
             messages: {
               successPickedAllWithdrawables: "Congratulations, your robot succeeded this mission!",
               failureReachExit: "Your robot didn't reach the green cell."
            }
         },
         nl: {
            label: {
               
            },
             messages: {
               successPickedAllWithdrawables: "Bravo, je robot heeft de opdracht volbracht!",
               failureReachExit: "Je robot heeft het groene vakje niet bereikt."
            }
         },

         es: {
            label: {
               
            },
             messages: {
               successPickedAllWithdrawables: "Bravo, ¡su robot ha completado la misión!",
               failureReachExit: "Su robot no llegó a la casilla verde."
            }
         },

         de: {
            label: {
               
            },
             messages: {
               successPickedAllWithdrawables: "Bravo, der Roboter hat die Mission abgeschlossen!",
               failureReachExit: "Der Roboter hat das grüne Feld nicht erreicht."
            }
         },
      },
      chticode_rel: {
         fr: {
            label: {
               
            },
             messages: {
               successReachExit: "Bravo, votre robot a atteint la case verte !",
               failureReachExit: "Votre robot n'a pas atteint la case verte."
            }
         },
         en: {
            label: {
               
            },
             messages: {
               successReachExit: "Congratulations, your robot reached the green cells!",
               failureReachExit: "Your robot didn't reach the green cell."
            }
         },
         nl: {
            label: {
               
            },
             messages: {
               successReachExit: "Bravo, je robot heeft het groene vakje bereikt!",
               failureReachExit: "Je robot heeft het groene vakje niet bereikt."
            }
         },

         es: {
            label: {
               
            },
             messages: {
               successReachExit: "Bravo, ¡su robot llegó a la casilla verde!",
               failureReachExit: "Su robot no ha llegado a la casilla verde."
            }
         },

         de: {
            label: {
               
            },
             messages: {
               successReachExit: "Sehr gut, der Roboter hat das grüne Feld erreicht!",
               failureReachExit: "Der Roboter steht nicht auf dem grünen Feld."
            }
         }
      },
      cones: {
         fr: {
            label: {
               dropObject: "déposer un plot",
               onContainer: "sur une case marquée",
               obstacleInFront: "plot devant"
            },
            code: {
               dropObject: "deposerPlot",
               onContainer: "surCaseMarquee",
               obstacleInFront: "plotDevant"
            },
            messages: {
               successContainersFilled: "Bravo, votre robot a déposé des plots sur les bonnes cases !",
               failureContainersFilled: "Il manque des plots ou ils ne sont pas au bon endroit."
            }
         },

         en: {
            label: {
               dropObject: "drop a cone",
               onContainer: "on a marked cell",
               obstacleInFront: "cone ahead"
            },
            code: {
               dropObject: "dropCone",
               onContainer: "onMarkedCell",
               obstacleInFront: "coneAhead"
            },
            messages: {
               successContainersFilled: "Congratulations, your robot dropped cones on the marked cells!",
               failureContainersFilled: "Some cones are missing or are misplaced."
            }
         },
         nl: {
            label: {
               dropObject: "een pion neerzetten",
               onContainer: "op een gemarkeerd vakje",
               obstacleInFront: "pion voor"
            },
            code: {
               dropObject: "zetPionNeer",
               onContainer: "opGemarkeerdVakje",
               obstacleInFront: "pionVoor"
            },
            messages: {
               successContainersFilled: "Bravo, je robot heeft pionnen op de juiste vakjes gezet!",
               failureContainersFilled: "Er ontbreken pionnen of ze staan niet op de juiste plaats."
            }
         },

         es: {
            label: {
               dropObject: "soltar un cono",
               onContainer: "sobre una casilla marcada",
               obstacleInFront: "cono adelante"
            },
            code: {
               dropObject: "soltarCono",
               onContainer: "sobreCasillaMarcada",
               obstacleInFront: "conoAdelante"
            },
            messages: {
               successContainersFilled: "Bravo, ¡Su robot ha puesto los conos en las casillas correctas!",
               failureContainersFilled: "Aún hay conos en lugares incorrectos."
            }
         },
         de: {
            label: {
               dropObject: "platziere Leitkegel",
               onContainer: "auf Ablageplatz",
               obstacleInFront: "vor Leitkegel"
            },
            code: {
               dropObject: "platziereLeitkegel",
               onContainer: "aufAblageplatz",
               obstacleInFront: "vorLeitkegel"
            },
            messages: {
               successContainersFilled: "Bravo, der Roboter hat alle Kegel auf markierten Feldern abgestellt.",
               failureContainersFilled: "Es fehlen Leitkegel oder sie sind nicht richtig platziert."
            }
         }
      },   
      flowers: {
         fr: {
            label: {
               dropObject: "semer une graine",
               onContainer: "terre sur la case",
               obstacleInFront: "fleur devant"
            },
            code: {
               dropObject: "semerGraine",
               onContainer: "terreSurCase",
               obstacleInFront: "fleurDevant"
            },
            description: {
               dropObject: "semerGraine() sème une graine sur la case du robot",
               onContainer: "terreSurCase() indique s'il y a de la terre sur la case du robot",
               obstacleInFront: "fleurDevant() indique s'il y a une fleur sur la case devant le robot"
            },
            messages: {
               successContainersFilled: "Bravo, votre robot est un bon jardinier !",
               failureContainersFilled: "Votre robot a semé hors des zones de terre.",
               failureContainersFilledLess: "Il reste de la terre vide de fleur !",
               failureDropObject: "Il y a déjà une fleur ici !",
					obstacle: "Attention à la fleur !",
            }
         },
         en: {
            label: {
               dropObject: "plant a seed",
               onContainer: "soil on the cell",
               obstacleInFront: "flower ahead"
            },
            code: {
               dropObject: "plantSeed",
               onContainer: "soilOnCell",
               obstacleInFront: "flowerAhead"
            },
            messages: {
               successContainersFilled: "Congratulations, your robot is a good gardener!",
               failureContainersFilled: "Your robot dropped seeds where there is no soil.",
               failureContainersFilledLess: "Some soil spots don't have any flower!",
               failureDropObject: "There is already a flower here !",
					obstacle: "Be careful, there's a flower!",
            }
         },
         nl: {
            label: {
               dropObject: "een zaadje zaaien",
               onContainer: "aarde op het vakje",
               obstacleInFront: "bloem voor"
            },
            code: {
               dropObject: "zaaiZaadje",
               onContainer: "aardeOpVakje",
               obstacleInFront: "bloemVoor"
            },
            description: {
               dropObject: "zaaiZaadje() zaait een zaadje op het vakje van de robot",
               onContainer: "aardeOpVakje() geeft aan of er aarde op het vakje van de robot is",
               obstacleInFront: "bloemVoor() geeft aan of er een bloem op het vakje voor de robot is"
            },
            messages: {
               successContainersFilled: "Bravo, je robot is een goede tuinier!",
               failureContainersFilled: "Je robot heeft buiten de aardeszones gezaaid.",
               failureContainersFilledLess: "Er is nog aarde zonder bloem!",
               failureDropObject: "Er staat hier al een bloem!",
               obstacle: "Let op de bloem!",
            }
         },

         es: {
            label: {
               dropObject: "sembrar una semilla",
               onContainer: "tierra en la casilla",
               obstacleInFront: "flor adelante"
            },
            code: {
               dropObject: "sembrarSemilla",
               onContainer: "tierraEnCasilla",
               obstacleInFront: "florAdelante"
            },
            messages: {
               successContainersFilled: "Bravo, ¡el robot es un gran jardinero!",
               failureContainersFilled: "El robot ha sembrado fuera de las casillas con tierra",
               failureDropObject: "Ya hay una flor aqui !",
               failureContainersFilledLess: "¡Aún hay tierra sin flores!"
            }
         },
         de: {
            label: {
               dropObject: "pflanze Blume",
               onContainer: "auf Erdhaufen",
               obstacleInFront: "vor Blume"
            },
            code: {
               dropObject: "pflanzeBlume",
               onContainer: "aufErdhaufen",
               obstacleInFront: "vorBlume"
            },
            description: {
            },
            messages: {
               successContainersFilled: "Großartig, der Roboter hat alle Blumen gepflanzt!",
               failureContainersFilled: "Der Roboter hat Blumen gepflanzt wo keine Erde ist.",
               failureContainersFilledLess: "In mindestens einem Erdhaufen wurde noch keine Blumen gepflanzt!",
               failureDropObject: "Hier wächst schon eine Blume",
					obstacle: "Vorsichtig, hier kann der Roboter nicht lang!",
            }
         },
      },   
      course: {
         fr: {
            messages: {
               successReachExit: "Bravo, le robot a atteint le drapeau !",
               failureReachExit: "Le robot n'est pas arrivé sur la case du drapeau.",
               obstacle: "Le robot tente de foncer dans un buisson !"
            }
         },
         en: {
            messages: {
               successReachExit: "Congratulations, the robot reached the flag!",
               failureReachExit: "The robot didn't reach the flag.",
               obstacle: "The robot is attemting to run into a bush!"
            }
         },
         nl: {
            messages: {
               successReachExit: "Bravo, de robot heeft de vlag bereikt!",
               failureReachExit: "De robot is niet op het vakje van de vlag aangekomen.",
               obstacle: "De robot probeert in een struik te rijden!"
            }
         },

         es: {
            messages: {
               successReachExit: "Bravo, ¡El robot llegó a la bandera!",
               failureReachExit: "El robot no llegó a la bandera.",
               obstacle: "¡El robot intenta traspasar un arbusto!"
            }
         },
         de: {
            label: {
               onContainer: "auf Flagge",
            },
            code: {
               onContainer: "aufFlagge",
            },
            messages: {
               successReachExit: "Bravo, der Roboter hat die Flagge erobert.",
               failureReachExit: "Der Roboter hat die Flagge nicht erobert.",
               obstacle: "Der Roboter ist gegen ein Hindernis gelaufen."
            }
         },
      },
      dominoes: {
         fr: {
            label: {
               withdrawObject: "ramasser le domino",
            },
            code: {
               withdrawObject: "ramasserDomino"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, le robot a ramassé tous les dominos demandés !",
               "successPickedAllWithdrawablesSingular": "Bravo, le robot a ramassé le domino demandé !",
               "failurePickedAllWithdrawables": "Le robot n'a pas ramassé les dominos demandés.",
               "failurePickedAllWithdrawablesSingular": "Le robot n'a pas ramassé le domino demandé.",
               failureUnfilteredObject: "Le robot a ramassé un domino non demandé."
            }
         },
         en: {
            label: {
               withdrawObject: "pick the domino",
            },
            code: {
               withdrawObject: "pickDomino"
            },
            messages: {
               "successPickedAllWithdrawables": "Congratulations, the robot picked all the requested dominoes!",
               "failurePickedAllWithdrawables": "The robot didn't pick up the requested dominoes!"
            }
         },
         nl: {
            label: {
               withdrawObject: "de domino oprapen",
               onObject: "op een domino"
            },
            code: {
               withdrawObject: "raapDominoOp",
               onObject: "opDomino"
            },
            description: {
               withdrawObject: "raapDominoOp() raapt de domino op het vakje van de robot op",
               onObject: "opDomino() test of de robot op het vakje van een domino staat"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, de robot heeft alle gevraagde domino's opgeraapt!",
               "failurePickedAllWithdrawables": "De robot heeft de gevraagde domino's niet opgeraapt."
            }
         },
         es: {
            label: {
               withdrawObject: "recoger el dominó",
            },
            code: {
               withdrawObject: "recogerDomino"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, ¡el robot recogió todos los dominó requeridos!",
               "failurePickedAllWithdrawables": "El robot no recogió todos los dominó requeridos."
            }
         },
         de: {
            label: {
               withdrawObject: "hebe Dominostein auf",
            },
            code: {
               withdrawObject: "hebeDominosteinAuf",
            },
            description: {
            },
            messages: {
               "successPickedAllWithdrawables": "Super, der Roboter hat alle geforderten Dominosteine aufgehoben!",
               "failurePickedAllWithdrawables": "Der Roboter hat nicht alle geforderten Dominosteine aufgehoben."
            }
         },
      },
      biscuits: {
         fr: {
            label: {
               withdrawObject: "ramasser le biscuit",
               dropObject: "déposer le biscuit"
            },
            code: {
               withdrawObject: "ramasserBiscuit",
               dropObject: "deposerBiscuit"
            },
            description: {
               withdrawObject: "ramasserBiscuit() ramasse le biscuit sur la case du robot",
               dropObject: "deposerBiscuit() dépose le dernier biscuit ramassé, sur la case du robot"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, le robot a ramassé tous les biscuits demandés !",
               "failurePickedAllWithdrawables": "Le robot n'a pas ramassé les biscuits demandés."
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the biscuit",
               dropObject: "drop the biscuit"
            },
            code: {
               withdrawObject: "pickBiscuit",
               dropObject: "dropBiscuit"
            },
            description: {
               withdrawObject: "pickBiscuit() picks up the biscuit on the robot's cell",
               dropObject: "dropBiscuit() drops the last picked biscuit on the robot's cell"
            },
            messages: {
               "successPickedAllWithdrawables": "Congratulations, the robot picked up all the required biscuits!",
               "failurePickedAllWithdrawables": "The robot did not pick up the required biscuits."
            }
         },
         nl: {
            label: {
               withdrawObject: "het koekje oprapen",
               dropObject: "het koekje neerleggen"
            },
            code: {
               withdrawObject: "raapKoekjeOp",
               dropObject: "legKoekjeNeer"
            },
            description: {
               withdrawObject: "raapKoekjeOp() raapt het koekje op het vakje van de robot op",
               dropObject: "legKoekjeNeer() legt het laatst opgeraapte koekje neer op het vakje van de robot"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, de robot heeft alle gevraagde koekjes opgeraapt!",
               "failurePickedAllWithdrawables": "De robot heeft de gevraagde koekjes niet opgeraapt."
            }
         },
         de: {
            label: {
               withdrawObject: "den Keks aufheben",
               dropObject: "den Keks ablegen"
            },
            code: {
               withdrawObject: "keksAufheben",
               dropObject: "keksAblegen"
            },
            description: {
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, der Roboter hat alle geforderten Kekse aufgehoben!",
               "failurePickedAllWithdrawables": "Der Roboter hat die geforderten Kekse nicht aufgehoben."
            }
         },
      },
      poker: {
         fr: {
            label: {
               withdrawObject: "ramasser la carte",
            },
            code: {
               withdrawObject: "ramasserCarte"
            },
            description: {
               withdrawObject: "ramasserCarte() ramasse la carte sur la case du robot"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, le robot a ramassé toutes les cartes demandées !",
               "failurePickedAllWithdrawables": "Le robot n'a pas ramassé les cartes demandées."
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the card",
            },
            code: {
               withdrawObject: "pickCard"
            },
            description: {
               withdrawObject: "pickCard() picks up the card on the robot's cell"
            },
            messages: {
               "successPickedAllWithdrawables": "Congratulations, the robot picked up all the required cards!",
               "failurePickedAllWithdrawables": "The robot did not pick up the required cards."
            }
         },
         nl: {
            label: {
               withdrawObject: "de kaart oprapen",
            },
            code: {
               withdrawObject: "raapKaartOp"
            },
            description: {
               withdrawObject: "raapKaartOp() raapt de kaart op het vakje van de robot op"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, de robot heeft alle gevraagde kaarten opgeraapt!",
               "failurePickedAllWithdrawables": "De robot heeft de gevraagde kaarten niet opgeraapt."
            }
         },
         de: {
            label: {
               withdrawObject: "die Karte aufheben",
            },
            code: {
               withdrawObject: "karteAufheben"
            },
            description: {
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, der Roboter hat alle geforderten Karten aufgehoben!",
               "failurePickedAllWithdrawables": "Der Roboter hat die geforderten Karten nicht aufgehoben."
            }
         },
      },
      pearls: {
         fr: {
            label: {
               withdrawObject: "ramasser la perle",
            },
            code: {
               withdrawObject: "ramasserPerle"
            },
            description: {
               withdrawObject: "ramasserPerle() ramasse la perle sur la case du robot"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, le robot a ramassé toutes les perles demandées !",
               "failurePickedAllWithdrawables": "Le robot n'a pas ramassé les perles demandées."
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the pearl",
            },
            code: {
               withdrawObject: "pickPearl"
            },
            description: {
               withdrawObject: "pickPearl() picks up the pearl on the robot's cell"
            },
            messages: {
               "successPickedAllWithdrawables": "Congratulations, the robot picked up all the required pearls!",
               "failurePickedAllWithdrawables": "The robot did not pick up the required pearls."
            }
         },
         nl: {
            label: {
               withdrawObject: "de parel oprapen",
            },
            code: {
               withdrawObject: "raapParelOp"
            },
            description: {
               withdrawObject: "raapParelOp() raapt de parel op het vakje van de robot op"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, de robot heeft alle gevraagde parels opgeraapt!",
               "failurePickedAllWithdrawables": "De robot heeft de gevraagde parels niet opgeraapt."
            }
         },
         de: {
            label: {
               withdrawObject: "die Perle aufheben",
            },
            code: {
               withdrawObject: "perleAufheben"
            },
            description: {
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, der Roboter hat alle geforderten Perlen aufgehoben!",
               "failurePickedAllWithdrawables": "Der Roboter hat die geforderten Perlen nicht aufgehoben."
            }
         },
      },
      fishing: {
         fr: {
            label: {
               withdrawObject: "prendre les poissons",
               dropObject: "déposer les poissons",
               withdrawNum_noShadow: "prendre %1 poissons",
               dropNum_noShadow: "déposer %1 poissons",
               nbWithdrawables: "nombre de poissons sur la case",
               containerSize: "nombre de poissons commandés",
               onObject: "poissons sur la case",
               onContainer: "sur une île",
            },
            code: {
               withdrawObject: "prendrePoissons",
               dropObject: "deposerPoissons",
               onObject: "surPoissons",
               onContainer: "surIle",
               nbWithdrawables: "nbPoissonsSur",
               containerSize: "nbPoissonsCommandes",
               withdrawNum: "prendre",
            },
            description: {
               withdrawObject: "prendrePoissons() prend les poissons qui se trouvent sur la case",
               dropObject: "deposerPoissons() dépose sur la case les poissons transportés",
               onObject: "surPoissons() indique s'il y a un ou des poissons sur la case",
               onContainer: "surIle() indique s'il y a une île sur la case",
               nbWithdrawables: "nbPoissonsSur() indique combien de poissons sont sur la case",
               containerSize: "nbPoissonsCommandes() indique il faut livrer de poissons sur l'île",
               dropNum: "deposer(nbPoissons) dépose nbPoissons poissons sur la case",
               withdrawNum: "prendre(nbPoissons) prend nbPoissons poissons sur la case",
            },
            messages: {
               emptyBag: "Le robot ne porte pas de poisson !",

               tooManyObjects: "Le robot porte déjà un poisson !",
               successContainersFilled: "Bravo, votre robot a apporté du poisson sur toutes les îles !",
               failureContainersFilled: "Votre robot a remis du poisson à l'eau !",
               failureContainersFilledLess: "Il reste encore au moins un poisson à apporter sur une île.",
               failureContainersFilledBag: "Il faut apporter les poissons sur une île !",
               failureDropObject: "Cette île a déjà reçu assez de poissons.",
               nothingToPickUp: "Pas de poisson ici !",
               failureContainersFilledBag: "Votre robot a pris trop de poissons.",
               failureDropObject: "Votre robot essaie de déposer trop de poissons sur cette île."
            }
         },
         en: {
            label: {
               withdrawObject: "take the fish",
               dropObject: "drop the fish",
               withdrawNum: "take %1 fish",
               withdrawNum_noShadow: "take %1 fish",
               dropNum: "drop %1 fish",
               dropNum_noShadow: "drop %1 fish",
               nbWithdrawables: "number of fish on the cell",
               containerSize: "number of fish ordered",
               onObject: "fish on the cell",
               onContainer: "on an island",
            },
            code: {
               withdrawObject: "takeFish",
               dropObject: "dropFish",
               onObject: "onFish",
               onContainer: "onIsland",
               nbWithdrawables: "nbFishOn",
               containerSize: "nbFishOrdered",
               withdrawNum: "take",
               withdrawNum_noShadow: "take"
            },
            description: {
               withdrawObject: "takeFish() takes the fish on the cell",
               dropObject: "dropFish() drops a carried fish on the cell",
               onObject: "onFish() indicates whether there are fish on the cell",
               onContainer: "onIsland() indicates whether there is an island on the cell",
               nbWithdrawables: "nbFishOn() indicates how many fish are on the cell",
               containerSize: "nbFishOrdered() indicates how many fish must be delivered to the island",
               dropNum: "drop(nbFish) drops nbFish fish on the cell",
               withdrawNum: "take(nbFish) takes nbFish fish from the cell",
            },
            messages: {
               emptyBag: "The robot is not carrying any fish!",
               tooManyObjects: "The robot is already carrying a fish!",
               successContainersFilled: "Congratulations, your robot brought fish to all the islands!",
               failureContainersFilled: "Your robot put fish back in the water!",
               failureContainersFilledLess: "There is still at least one fish to bring to an island.",
               failureContainersFilledBag: "Your robot took too many fish.",
               failureDropObject: "Your robot is trying to drop too many fish on this island.",
               nothingToPickUp: "No fish here!",
            }
         },
         nl: {
            label: {
               withdrawObject: "de vis nemen",
               dropObject: "de vis neerleggen",
               withdrawNum: "%1 vissen nemen",
               withdrawNum_noShadow: "%1 vissen nemen",
               dropNum: "%1 vissen neerleggen",
               dropNum_noShadow: "%1 vissen neerleggen",
               nbWithdrawables: "aantal vissen op het vakje",
               containerSize: "aantal bestelde vissen",
               onObject: "vis op het vakje",
               onContainer: "op een eiland",
            },
            code: {
               withdrawObject: "neemVis",
               dropObject: "legVisNeer",
               onObject: "opVis",
               onContainer: "opEiland",
               nbWithdrawables: "nbVissenOp",
               containerSize: "nbVissenBesteld",
               withdrawNum: "nemen",
               withdrawNum_noShadow: "nemen"
            },
            description: {
               withdrawObject: "neemVis() neemt de vis die op het vakje ligt",
               dropObject: "legVisNeer() legt een gedragen vis neer op het vakje",
               onObject: "opVis() geeft aan of er een of meer vissen op het vakje liggen",
               onContainer: "opEiland() geeft aan of er een eiland op het vakje is",
               nbWithdrawables: "nbVissenOp() geeft aan hoeveel vissen er op het vakje liggen",
               containerSize: "nbVissenBesteld() geeft aan hoeveel vissen er op het eiland geleverd moeten worden",
               dropNum: "neerleggen(nbVissen) legt nbVissen vissen neer op het vakje",
               withdrawNum: "nemen(nbVissen) neemt nbVissen vissen van het vakje",
            },
            messages: {
               emptyBag: "De robot draagt geen vis!",
               tooManyObjects: "De robot draagt al een vis!",
               successContainersFilled: "Bravo, je robot heeft vis naar alle eilanden gebracht!",
               failureContainersFilled: "Je robot heeft vis terug in het water gelegd!",
               failureContainersFilledLess: "Er moet nog minstens één vis naar een eiland gebracht worden.",
               failureContainersFilledBag: "Je robot heeft te veel vissen genomen.",
               failureDropObject: "Je robot probeert te veel vissen op dit eiland neer te leggen.",
               nothingToPickUp: "Geen vis hier!",
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la bola",
               dropObject: "soltar la bola",
               onObject: "sobre una bola",
               onContainer: "sobre un agujero",
            },
            code: {
               withdrawObject: "recogerBola",
               dropObject: "soltarBola",
               onObject: "sobreBola",
               onContainer: "sobreAgujero",
            },   
            messages: {
               emptyBag: "¡El robot no carga ninguna bola!",
               tooManyObjects: "¡El robot ya está cargando una bola!",
               successContainersFilled: "Bravo, ¡el robot ordenó las bolas!",
               failureContainersFilled: "Hay bolas en lugares incorrectos.",
               failureContainersFilledLess: "Aún falta colocar una bola.",
               failureContainersFilledBag: "¡Debe colocar la bola en un agujero!",
            }
         },
         de: {
            label: {
               withdrawObject: "nimm Fisch",
               dropObject: "liefere Fisch ab",
               withdrawNum_noShadow: "nimm %1 Fische",
               dropNum_noShadow: "liefere %1 Fische ab",
               withdrawNum: "nimm %1 Fische",
               dropNum: "liefere %1 Fische ab",
               nbWithdrawables: "Anzahl der Fische",
               containerSize: "Anzahl der bestellten Fische",
               onObject: "auf Fisch",
               onContainer: "auf Insel",
               nbInBag: "Anzahl Fische in Tasche"
            },
            code: {
               withdrawObject: "nimmFisch",
               dropObject: "liefereFischAb",
               onObject: "aufFisch",
               onContainer: "aufInsel",
               nbWithdrawables: "anzahlFische",
               containerSize: "anzahlBestellteFische",
               dropNum: "legeFischeAb",
               withdrawNum: "fangeFische",
            },
            description: {
            },
            // description: {
            //    withdrawObject: "fangeFisch() nimmt einen Fisch vom Platz",
            //    dropObject: "legeFischAb() legt einen Fisch ab",
            //    onObject: "aufFisch() zeigt an, ob sich ein oder mehrere Fische auf dem Feld befinden",
            //    onContainer: "aufInsel() zeigt an, ob sich auf dem Feld eine Insel befindet",
            //    nbWithdrawables: "anzahlFische() gibt an, wie viele Fische sich auf dem Platz befinden",
            //    containerSize: "anzahlBestellteFische() zeigt an, wie viele Fische auf die Insel geliefert werden müssen",
            //    dropNum: "legeFischeAb(Anzahl) legt Anzahl Fische ab",
            //    withdrawNum: "fangeFische(Anzahl) hebt Anzahl Fische auf",
            // },
            messages: {
               emptyBag: "Der Roboter trägt keine Fische!",
               tooManyObjects: "Der Roboter trägt bereits einen Fisch!",
               successContainersFilled: "Gut gemacht, der Roboter hat Fische auf alle Inseln gebracht!",
               failureContainersFilled: "Der Roboter hat einige Fische wieder ins Wasser gesetzt!",
               failureContainersFilledLess: "Es muss noch mindestens ein Fisch auf eine Insel gebracht werden.",
               failureContainersFilledBag: "Der Roboter muss den Fisch auf eine Insel bringen!",
               failureDropObject: "Diese Insel hat bereits genug Fisch erhalten.",
               nothingToPickUp: "Hier gibt es keine Fische.",
               failureContainersFilledBag: "Der Roboter hat zu viele Fische gefangen.",
               failureDropObject: "Der Roboter versucht, zu viele Fische auf dieser Insel auszuliefern."
            }
         },
      },
      
      marbles: {
         fr: {
            label: {
               withdrawObject: "ramasser la bille",
               dropObject: "déposer la bille",
               onObject: "sur une bille",
               onContainer: "sur un trou",
            },
            code: {
               withdrawObject: "ramasserBille",
               dropObject: "deposerBille",
               onObject: "surBille",
               onContainer: "surTrou",
            },   
            description: {
               withdrawObject: "ramasserBille() ramasse la bille de la case du robot",
               dropObject: "deposerBille() dépose la bille transportée sur la case du robot",
               onObject: "surBille() indique une bille est sur la case du robot",
               onContainer: "surTrou() indique s'il y a un trou sur la case du robot",
            },   
            messages: {
               emptyBag: "Le robot ne porte pas de bille !",
               tooManyObjects: "Le robot porte déjà une bille !",
               successContainersFilled: "Bravo, vous avez rangé les billes !",
               successContainersFilledSingular: "Bravo, vous avez rangé la bille !",
               failureContainersFilled: "Les billes ne sont pas toutes bien rangées.",
               failureContainersFilledSingular: "La bille n'est pas rangée dans le trou.",
               failureContainersFilledLess: "Il reste une bille à ranger.",
               failureContainersFilledBag: "Il faut déposer la bille dans le trou !",
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the marble",
               dropObject: "drop the marble",
               onObject: "on a marble",
               onContainer: "on a hole",
            },
            code: {
               withdrawObject: "pickMarble",
               dropObject: "dropMarble",
               onObject: "onMarble",
               onContainer: "onHole",
            },
            description: {
               withdrawObject: "pickMarble() picks up the marble on the robot's cell",
               dropObject: "dropMarble() drops the carried marble on the robot's cell",
               onObject: "onMarble() indicates whether there is a marble on the robot's cell",
               onContainer: "onHole() indicates whether there is a hole on the robot's cell",
            },
            messages: {
               emptyBag: "The robot is not carrying a marble!",
               tooManyObjects: "The robot is already carrying a marble!",
               successContainersFilled: "Congratulations, you sorted the marbles!",
               successContainersFilledSingular: "Congratulations, you sorted the marble!",
               failureContainersFilled: "Not all marbles are correctly placed.",
               failureContainersFilledSingular: "The marble is not in the hole.",
               failureContainersFilledLess: "There is still one marble to place.",
               failureContainersFilledBag: "You must drop the marble in the hole!",
            }
         },
         nl: {
            label: {
               withdrawObject: "de knikker oprapen",
               dropObject: "de knikker neerleggen",
               onObject: "op een knikker",
               onContainer: "op een gat",
            },
            code: {
               withdrawObject: "raapKnikkerOp",
               dropObject: "legKnikkerNeer",
               onObject: "opKnikker",
               onContainer: "opGat",
            },
            description: {
               withdrawObject: "raapKnikkerOp() raapt de knikker op het vakje van de robot op",
               dropObject: "legKnikkerNeer() legt de gedragen knikker neer op het vakje van de robot",
               onObject: "opKnikker() geeft aan of er een knikker op het vakje van de robot ligt",
               onContainer: "opGat() geeft aan of er een gat op het vakje van de robot is",
            },
            messages: {
               emptyBag: "De robot draagt geen knikker!",
               tooManyObjects: "De robot draagt al een knikker!",
               successContainersFilled: "Bravo, je hebt de knikkers opgeruimd!",
               successContainersFilledSingular: "Bravo, je hebt de knikker opgeruimd!",
               failureContainersFilled: "Niet alle knikkers liggen goed.",
               failureContainersFilledSingular: "De knikker ligt niet in het gat.",
               failureContainersFilledLess: "Er moet nog één knikker opgeborgen worden.",
               failureContainersFilledBag: "Je moet de knikker in het gat leggen!",
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la bola",
               dropObject: "soltar la bola",
               onObject: "sobre una bola",
               onContainer: "sobre un agujero",
            },
            code: {
               withdrawObject: "recogerBola",
               dropObject: "soltarBola",
               onObject: "sobreBola",
               onContainer: "sobreAgujero",
            },   
            messages: {
               emptyBag: "¡El robot no carga ninguna bola!",
               tooManyObjects: "¡El robot ya está cargando una bola!",
               successContainersFilled: "Bravo, ¡el robot ordenó las bolas!",
               failureContainersFilled: "Hay bolas en lugares incorrectos.",
               failureContainersFilledLess: "Aún falta colocar una bola.",
               failureContainersFilledBag: "¡Debe colocar la bola en un agujero!",
            }
         },
         de: {
            label: {
               withdrawObject: "hebe Murmel auf",
               dropObject: "lege Murmel ab",
               onObject: "auf Murmel",
               onContainer: "auf Loch",
            },
            code: {
               withdrawObject: "hebeMurmelAuf",
               dropObject: "legeMurmelAb",
               onObject: "aufMurmel",
               onContainer: "aufLoch",
            },
            description: {
            },   
            // description: {
            //    withdrawObject: "hebeMurmelAuf() hebt die Murmel auf",
            //    dropObject: "legeMurmelAb() legt die Murmel ab",
            //    onObject: "aufMurmel() zeigt an, ob sich der Roboter auf einer Murmel befindet",
            //    onContainer: "aufLoch() zeigt an, ob sich der Roboter auf einem Loch befindet",
            // },   
            messages: {
               emptyBag: "Der Roboter trägt keine Murmel!",
               tooManyObjects: "Der Roboter kann nur eine Murmel tragen.",
               successContainersFilled: "Bravo, der Roboter hat alle Murmeln in Löcher gelegt.",
               successContainersFilledSingular: "Bravo, du hast die Murmel weggeräumt!",
               failureContainersFilled: "Nicht alle Murmeln sind wie gefordert abgelegt.",
               failureContainersFilledSingular: "Die Murmel liegt nicht im Loch.",
               failureContainersFilledLess: "Es müssen noch Murmeln abgelegt werden.",
               failureContainersFilledBag: "Die Murmeln müssen in die Löcher gelegt werden!",
            }
         },
      },
      objects_in_space: {
         fr: {
            label: {
               obstacleInFront: "astéroïde devant"
            },
            code: {
               obstacleInFront: "asteroideDevant"
            },
            messages: {
               obstacle: "Attention à l'astéroïde !"
            }
         },
         en: {
            label: {
               obstacleInFront: "asteroid ahead"
            },
            code: {
               obstacleInFront: "asteroidAhead"
            },
            messages: {
               obstacle: "Watch out for the asteroid!"
            }
         },
         nl: {
            label: {
               obstacleInFront: "asteroïde vooruit"
            },
            code: {
               obstacleInFront: "asteroideVooruit"
            },
            messages: {
               obstacle: "Opgepast voor de asteroïde !"
            }
         },

         es: {
            label: {
               obstacleInFront: "asteroide adelante"
            },
            code: {
               obstacleInFront: "asteroideAdelante"
            },
            messages: {
               obstacle: "¡Cuidado con el asteroide!"
            }
         },
         de: {
            label: {
               obstacleInFront: "Asteroid voraus",
               obstacleEast: "Asteroid rechts",
               obstacleWest: "Asteroid links",
               obstacleSouth: "Asteroid hinten",
            },
            code: {
               obstacleInFront: "asteroidVoraus",
               obstacleEast: "asteroidRechts",
               obstacleWest: "asteroidLinks",
               obstacleSouth: "asteroidHinten",
            },
            messages: {
               obstacle: "Achtung, der Roboter ist fast gegen einen Asteroiden gefahren!"
            }
         },
      },
      packages: {
         fr: {
            label: {
               withdrawObject: "ramasser le livre",
               dropObject: "déposer le livre",
               withdrawNum_noShadow: "ramasser %1 livres",
               dropNum_noShadow: "déposer %1 livres",
               nbWithdrawables: "nombre de livres sur la case",
               containerSize: "nombre de livres commandés",
               onObject: "livres sur la case",
               onContainer: "sur un carton",
            },
            code: {
               withdrawObject: "ramasserLivre",
               dropObject: "deposerLivre",
               onObject: "surLivres",
               onContainer: "surCarton",
               nbWithdrawables: "nbLivresSur",
               containerSize: "nbLivresCommandes",
            },
            description: {
               withdrawObject: "ramasserLivre() ramasse le livre qui se trouve sur la case",
               dropObject: "deposerLivre() dépose sur la case le livre transporté",
               onObject: "surLivres() indique s'il y a un ou des livres sur la case",
               onContainer: "surCarton() indique s'il y a un carton sur la case",
               nbWithdrawables: "nbLivresSur() indique combien de livres sont sur la case",
               containerSize: "nbLivresCommandes() indique combien de livres sont commandés pour ce carton",
               dropNum: "deposer(nbLivres) dépose nLivres livres sur la case",
               withdrawNum: "ramasser(nbLivres) ramasse nbLivres livres sur la case",
            },
            messages: {
               emptyBag: "Le robot ne porte pas de livre !",
               tooManyObjects: "Le robot porte déjà un livre !",
               successContainersFilled: "Bravo, tous les cartons sont pleins. Les colis vont pouvoir être livrés !",
               failureContainersFilled: "Tous les livres n'ont pas été mis en carton.",
               failureContainersFilledLess: "Il reste au moins un livre à ranger dans un carton.",
               failureContainersFilledBag: "Il faut ranger les livres dans un carton !",
               failureDropObject: "Ce carton est déjà plein.",
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the book",
               dropObject: "drop the book",
               withdrawNum: "pick up %1 books",
               withdrawNum_noShadow: "pick up %1 books",
               dropNum: "drop %1 books",
               dropNum_noShadow: "drop %1 books",
               nbWithdrawables: "number of books on the cell",
               containerSize: "number of books ordered",
               onObject: "books on the cell",
               onContainer: "on a box",
            },
            code: {
               withdrawObject: "pickBook",
               dropObject: "dropBook",
               onObject: "onBooks",
               onContainer: "onBox",
               nbWithdrawables: "nbBooksOn",
               containerSize: "nbBooksOrdered",
            },
            description: {
               withdrawObject: "pickBook() picks up the book on the cell",
               dropObject: "dropBook() drops the carried book on the cell",
               onObject: "onBooks() indicates whether there are books on the cell",
               onContainer: "onBox() indicates whether there is a box on the cell",
               nbWithdrawables: "nbBooksOn() indicates how many books are on the cell",
               containerSize: "nbBooksOrdered() indicates how many books are ordered for this box",
               dropNum: "drop(nbBooks) drops nbBooks books on the cell",
               withdrawNum: "pick(nbBooks) picks up nbBooks books from the cell",
            },
            messages: {
               emptyBag: "The robot is not carrying a book!",
               tooManyObjects: "The robot is already carrying a book!",
               successContainersFilled: "Congratulations, all boxes are full. The packages can be delivered!",
               failureContainersFilled: "Not all books have been put in boxes.",
               failureContainersFilledLess: "There is at least one box that is not full.",
               failureContainersFilledBag: "Your robot picked up too many books.",
               failureDropObject: "This package is already full. Your robot is trying to drop too many books.",
               nothingToPickUp: "There are no more books here!"
            }
         },
         nl: {
            label: {
               withdrawObject: "het boek oprapen",
               dropObject: "het boek neerleggen",
               withdrawNum: "%1 boeken oprapen",
               withdrawNum_noShadow: "%1 boeken oprapen",
               dropNum: "%1 boeken neerleggen",
               dropNum_noShadow: "%1 boeken neerleggen",
               nbWithdrawables: "aantal boeken op het vakje",
               containerSize: "aantal bestelde boeken",
               onObject: "boeken op het vakje",
               onContainer: "op een doos",
            },
            code: {
               withdrawObject: "raapBoekOp",
               dropObject: "legBoekNeer",
               onObject: "opBoeken",
               onContainer: "opDoos",
               nbWithdrawables: "nbBoekenOp",
               containerSize: "nbBoekenBesteld",
            },
            description: {
               withdrawObject: "raapBoekOp() raapt het boek op dat op het vakje ligt",
               dropObject: "legBoekNeer() legt het gedragen boek neer op het vakje",
               onObject: "opBoeken() geeft aan of er een of meer boeken op het vakje liggen",
               onContainer: "opDoos() geeft aan of er een doos op het vakje is",
               nbWithdrawables: "nbBoekenOp() geeft aan hoeveel boeken er op het vakje liggen",
               containerSize: "nbBoekenBesteld() geeft aan hoeveel boeken er voor deze doos besteld zijn",
               dropNum: "neerleggen(nbBoeken) legt nbBoeken boeken neer op het vakje",
               withdrawNum: "oprapen(nbBoeken) raapt nbBoeken boeken op van het vakje",
            },
            messages: {
               emptyBag: "De robot draagt geen boek!",
               tooManyObjects: "De robot draagt al een boek!",
               successContainersFilled: "Bravo, alle dozen zijn vol. De pakketten kunnen geleverd worden!",
               failureContainersFilled: "Niet alle boeken zijn in een doos gestopt.",
               failureContainersFilledLess: "Er is minstens één doos die niet vol is.",
               failureContainersFilledBag: "Je robot heeft te veel boeken opgeraapt.",
               failureDropObject: "Dit pakket is al vol. Je robot probeert te veel boeken neer te leggen.",
               nothingToPickUp: "Er ligt hier geen boek meer!"
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la bola",
               dropObject: "soltar la bola",
               onObject: "sobre una bola",
               onContainer: "sobre un agujero",
            },
            code: {
               withdrawObject: "recogerBola",
               dropObject: "soltarBola",
               onObject: "sobreBola",
               onContainer: "sobreAgujero",
            },   
            messages: {
               emptyBag: "¡El robot no carga ninguna bola!",
               tooManyObjects: "¡El robot ya está cargando una bola!",
               successContainersFilled: "Bravo, ¡el robot ordenó las bolas!",
               failureContainersFilled: "Hay bolas en lugares incorrectos.",
               failureContainersFilledLess: "Aún falta colocar una bola.",
               failureContainersFilledBag: "¡Debe colocar la bola en un agujero!",
            }
         },
         de: {
            label: {
               withdrawObject: "nimm Buch",
               dropObject: "lege Buch ab",
               withdrawNum_noShadow: "nimm %1 Bücher",
               withdrawNum: "nimm %1 Bücher",
               dropNum: "lege %1 Bücher ab",
               dropNum_noShadow: "lege %1 Bücher ab",
               nbWithdrawables: "Anzahl der Bücher",
               containerSize: "Größe der Kiste",
               onObject: "auf Buch",
               onContainer: "auf Kiste",
            },
            code: {
               withdrawObject: "nimmBuch",
               dropObject: "legeBuchAb",
               onObject: "aufBuch",
               onContainer: "aufKiste",
               nbWithdrawables: "anzahlDerBuecher",
               containerSize: "groesseDerKiste",
            },
            description: {
            },
            // description: {
            //    withdrawObject: "nimmBuch() hebe das Buch an diesem Platz auf",
            //    dropObject: "legeBuchAb() lege das transportierte Buch in die Kiste",
            //    onObject: "aufBuch() gibt an, ob Bücher sich auf dem Platz befinden",
            //    onContainer: "aufKiste() zeigt an, ob sich eine Kiste auf dem Platz befindet",
            //    nbWithdrawables: "anzahlDerBücher() gibt an, wie viele Bücher sich auf dem Platz befinden",
            //    containerSize: "groesseDerKiste() gibt an, wie wie viele Bücher in die Kiste passen",
            //    dropNum: "legeAb(anzahlBücher) lege anzahlBücher Bücher in die Kiste",
            //    withdrawNum: "nimm(anzahlBücher) hebe anzahlBücher Bücher auf",
            // },
            messages: {
               emptyBag: "Der Roboter trägt keine Bücher!",
               tooManyObjects: "Der Roboter kann nur ein Buch tragen.",
               successContainersFilled: "Bravo, alle Kisten sind gepackt.",
               failureContainersFilled: "Nicht alle Bücher sind verpackt.",
               failureContainersFilledLess: "Mindestens ein Buch muss noch in einer Kiste verpackt werden.",
               failureContainersFilledBag: "Der Roboter muss die Bücher in die Kisten packen.",
               failureDropObject: "Die Kiste ist bereits voll.",
            }
         },
      },
      paint: {
         fr: {
             label: {
               dropObject: "peindre la case",
               onContainer: "sur une case marquée",
               readNumber: "nombre de la case",
             },
             code: {
                dropObject: "peindreCase",
                onContainer: "surCaseMarquee",
                readNumber: "nombreSurCase",
             },
             messages: {
               successContainersFilled: "Bravo, votre robot a peint le motif !",
               failureContainersFilledSingular: "Votre robot n'a pas peint la bonne case.",
               failureContainersFilled: "Votre robot n'a pas peint les bonnes cases.",
               failureContainersFilledLess: "Votre robot n'a pas peint toutes les cases marquées.",
               failureContainersFilledLessSingular: "Votre robot n'a pas peint la case.",
               failureContainersFilledBag: "Votre robot n'a pas posé tous les objets",
             }
         },
         en: {
             label: {
               dropObject: "paint the cell",
               onContainer: "on a marked cell",
               readNumber: "number on the cell",
             },
             code: {
                dropObject: "paintCell",
                onContainer: "onMarkedCell",
                readNumber: "numberOnCell"
            },
            description: {
               dropObject: "paintCell() paints the cell under the robot",
               onContainer: "onMarkedCell() indicates whether the robot is on a marked cell",
               readNumber: "numberOnCell() returns the number written on the cell under the robot"
             },
             messages: {
               successContainersFilled: "Congratulations, your robot painted the pattern!",
               failureContainersFilledSingular: "Your robot did not paint the correct cell.",
               failureContainersFilled: "Your robot did not paint the correct cells.",
               failureContainersFilledLess: "Your robot did not paint all the marked cells.",
               failureContainersFilledLessSingular: "Your robot did not paint the cell.",
               failureContainersFilledBag: "Your robot did not place all the objects",
             }
         },
         nl: {
             label: {
               dropObject: "het vakje schilderen",
               onContainer: "op een gemarkeerd vakje",
               readNumber: "nummer van het vakje",
             },
             code: {
                dropObject: "schilderVakje",
                onContainer: "opGemarkeerdVakje",
                readNumber: "nummerOpVakje"
            },
            description: {
               dropObject: "schilderVakje() schildert het vakje onder de robot",
               onContainer: "opGemarkeerdVakje() geeft aan of de robot op een gemarkeerd vakje staat",
               readNumber: "nummerOpVakje() geeft het nummer terug dat op het vakje onder de robot staat"
             },
             messages: {
               successContainersFilled: "Bravo, je robot heeft het motief geschilderd!",
               failureContainersFilledSingular: "Je robot heeft niet het juiste vakje geschilderd.",
               failureContainersFilled: "Je robot heeft niet de juiste vakjes geschilderd.",
               failureContainersFilledLess: "Je robot heeft niet alle gemarkeerde vakjes geschilderd.",
               failureContainersFilledLessSingular: "Je robot heeft het vakje niet geschilderd.",
               failureContainersFilledBag: "Je robot heeft niet alle voorwerpen geplaatst",
             }
         },

         es: {
             label: {
               dropObject: "pintar la casilla",
               onContainer: "sobre una casilla marcada",
               readNumber: "número en la casilla",
             },
             code: {
                dropObject: "pintarCasilla",
                onContainer: "sobreCasillaMarcada",
                readNumber: "númeroEnCasilla",
             },
             messages: {
               successContainersFilled: "Bravo, ¡su robot ha pintado el patrón!",
               failureContainersFilled: "El robot no pintó las casillas correctas.",
               failureContainersFilledLess: "Su robot no ha pintado todas las casillas marcadas.",
               failureContainersFilledBag: "Su robot no ha puesto todos los objetos",
             }
         },
         de: {
            label: {
              dropObject: "färbe Feld",
              onContainer: "auf Markierung",
              readNumber: "lies Zahl",
            },
            code: {
               dropObject: "faerbeFeld",
               onContainer: "aufMarkierung",
               readNumber: "leseZahl",
            },
            description: {
             },
            messages: {
              successContainersFilled: "Bravo, der Roboter hat das vorgegebene Muster richtig gemalt!",
               failureContainersFilledSingular: "Dein Roboter hat nicht das richtige Feld bemalt.",
              failureContainersFilled: "Der Roboter hat nicht die richtigen Felder bemalt.",
              failureContainersFilledLess: "Der Roboter hat nicht alle markierten Felder bemalt.",
               failureContainersFilledLessSingular: "Dein Roboter hat das Feld nicht bemalt.",
            }
        },  
      },
      pixelArt: {
         fr: {
            messages: {
               successContainersFilled: "Bravo, votre dessin est identique au modèle. Quel artiste !",
               failureContainersFilled: "Regardez bien le modèle, votre dessin n'est pas identique.",
				   failureContainersFilledLess: "Le dessin n'est pas fini !",
				   failureDropObject: "Le robot n'a pas peint la case de la bonne couleur.",
            }
         },
         en: {
            messages: {
               successContainersFilled: "Congratulations, your drawing matches the model. What an artist!",
               failureContainersFilled: "Look carefully at the model, your drawing is not identical.",
               failureContainersFilledLess: "The drawing is not finished!",
               failureDropObject: "The robot did not paint the cell with the correct color.",
            }
         },
         nl: {
            messages: {
               successContainersFilled: "Bravo, je tekening is identiek aan het model. Wat een kunstenaar!",
               failureContainersFilled: "Kijk goed naar het model, je tekening is niet identiek.",
               failureContainersFilledLess: "De tekening is niet af!",
               failureDropObject: "De robot heeft het vakje niet in de juiste kleur geschilderd.",
            }
         },
         de: {
            messages: {
               successContainersFilled: "Bravo, deine Zeichnung ist identisch mit dem Modell!",
               failureContainersFilled: "Zeichnung und Modell sind leider nicht identisch.",
				   failureContainersFilledLess: "Die Zeichnung ist noch nicht fertig!",
				   failureDropObject: "Der Roboter hat die falsche Farbe für das Feld genommen.",
               failureDropOutside: "Der Roboter versucht außerhalb der Leinwand zu malen."
            }
         }
      },
      rocket: {
         fr: {
            label: {
               obstacleRight: "asteroïde à droite",
               obstacleInFront: "asteroïde devant",
            },
            messages: {
               successReachExit: "Bravo, le robot a rejoint la fusée !",
               failureReachExit: "Le robot est perdu dans l'espace. Recommencez pour l'aider à rejoindre la fusée.",
               obstacle: "Attention à l'astéroïde !"
            }
         },
         en: {
            label: {
               obstacleRight: "asteroid on the right",
               obstacleInFront: "asteroid ahead",
               onExit: "on a rocket"
            },
            code: {
               onExit: "onRocket"
            },
            messages: {
               successReachExit: "Well done, the robot has reached the rocket!",
               failureReachExit: "The robot is lost in space. Try again to help it reach the rocket.",
               obstacle: "Watch out for the asteroid!"
            }
         },
         nl: {
            label: {
               obstacleRight: "asteroïde rechts",
               obstacleInFront: "asteroïde vooruit",
               onExit: "op een raket"
            },
            code: {
               onExit: "opRaket"
            },
            messages: {
               successReachExit: "Goed gedaan, de robot heeft de raket bereikt!",
               failureReachExit: "De robot is verdwaald in de ruimte. Probeer opnieuw om hem te helpen de raket te bereiken.",
               obstacle: "Pas op voor de asteroïde!"
            }
         },

         es: {
            label: {
               obstacleRight: "asteroide a la derecha",
               obstacleInFront: "asteroide adelante",
            },
            messages: {
               successReachExit: "Bravo, ¡el robot llegó al cohete!",
               failureReachExit: "El robot está perdido en el espacio. Vuelva a comenzar para ayudarle a llegar al cohete.",
               obstacle: "¡Cuidado con el asteroide!"
            }
         },
         de: { 
            label: {
               obstacleRight: "rechts von Asteroiden",
               obstacleInFront: "vor Asteroiden",
               onExit: "auf einer Rakete",
            },
            code: {
               onExit: "aufRakete",
               obstacleRight: "rechtsVonAsteroiden",
               obstacleInFront: "vorAsteroiden",
            },
            messages: {
               successReachExit: "Bravo, der Roboter ist zur Rakete zurückgekehrt!",
               failureReachExit: "Der Roboter ist im Weltraum verloren. Er hat die Rakete nicht erreicht.",
               successPickedAllWithdrawables: "Bravo, der Roboter ist zur Rakete zurückgekehrt!",
               failurePickedAllWithdrawables: "Der Roboter hat den Weltraumschrott liegen gelassen.",
               obstacle: "Achtung, Asteroiden!"
            }
         },
      },
      seashells: {
         fr: {
            label: {
               withdrawObject: "ramasser le coquillage",
               dropObject: "déposer les coquillages",
               withdrawNum: "prendre %1 coquillages",
               withdrawNum_noShadow: "prendre %1 coquillages",
               dropNum: "déposer %1 coquillages",
               dropNum_noShadow: "déposer %1 coquillages",
               nbWithdrawables: "nombre de coquillages sur la case",
               containerSize: "taille du panier",
               onObject: "sur un coquillage",
               onContainer: "sur un panier",
               obstacleNorth: "rocher au nord",
               obstacleSouth: "rocher au sud",
               obstacleEast: "rocher à l'est",
               obstacleWest: "rocher à l'ouest"
            },
            code: {
               withdrawObject: "ramasserCoquillage",
               dropObject: "deposerCoquillages",
               onObject: "surCoquillage",
               onContainer: "surPanier",
               nbWithdrawables: "nbCoquillages",
               containerSize: "taillePanier",
               withdrawNum: "ramasser",
               withdrawNum_noShadow: "ramasser",
               obstacleNorth: "rocherNord",
               obstacleSouth: "rocherSud",
               obstacleEast: "rocherEst",
               obstacleWest: "rocherOuest"
            },
            description: {
               withdrawObject: "ramasserCoquillage() ramasse le coquillage qui se trouve sur la case",
               dropObject: "deposerCoquillages() dépose tous les coquillages transportés",
               onObject: "surCoquillage() indique s'il y a un ou des coquillages sur la case",
               onContainer: "surPanier() indique s'il y a un panier sur la case",
               nbWithdrawables: "nbCoquillages() indique combien de coquillages sont sur la case",
               containerSize: "taillePanier() indique combien le panier doit contenir de coquillages",
               dropNum: "deposer(nbCoquillages) dépose nbCoquillages coquillagess sur la case",
               withdrawNum: "ramasser(nbCoquillages) ramasse nbCoquillages coquillages sur la case",
               obstacleNorth: "rocherNord() teste s'il y a un rocher sur la case au nord du robot",
               obstacleSouth: "rocherSud() teste s'il y a un rocher sur la case au nord du robot",
               obstacleEast: "rocherEst() teste s'il y a un rocher sur la case au nord du robot",
               obstacleWest: "rocherOuest() teste s'il y a un rocher sur la case au nord du robot"
            },
            messages: {
               emptyBag: "Le robot ne porte pas de coquillage !",
               successContainersFilled: "Bravo, votre robot a collecté tous les coquillages !",
               failureContainersFilledLess: "Il reste encore au moins un coquillage à ramasser.",
               failureContainersFilledBag: "Il faut apporter les coquillages dans le panier !",
               failureDropObject: "Ce panier a déjà assez de coquillages.",
               nothingToPickUp: "Pas de coquillage ici !",
               failureContainersFilledBag: "Votre robot a ramassé trop de coquillages.",
               failureDropObject: "Votre robot essaie de déposer trop de coquillages dans ce panier.",
               obstacle: "Le robot essaie de foncer dans un rocher.",
               failureReachExit: "Le robot n'a pas déposé les coquillages dans le panier."
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the seashell",
               dropObject: "drop the seashells",
               withdrawNum: "take %1 seashells",
               withdrawNum_noShadow: "take %1 seashells",
               dropNum: "drop %1 seashells",
               dropNum_noShadow: "drop %1 seashells",
               nbWithdrawables: "number of seashells on the cell",
               containerSize: "basket size",
               onObject: "on a seashell",
               onContainer: "on a basket",
               obstacleNorth: "rock to the north",
               obstacleSouth: "rock to the south",
               obstacleEast: "rock to the east",
               obstacleWest: "rock to the west"
            },
            code: {
               withdrawObject: "pickSeashell",
               dropObject: "dropSeashells",
               onObject: "onSeashell",
               onContainer: "onBasket",
               nbWithdrawables: "nbSeashells",
               containerSize: "basketSize",
               withdrawNum: "pick",
               withdrawNum_noShadow: "pick",
               obstacleNorth: "rockNorth",
               obstacleSouth: "rockSouth",
               obstacleEast: "rockEast",
               obstacleWest: "rockWest"
            },
            description: {
               withdrawObject: "pickSeashell() picks up the seashell on the cell",
               dropObject: "dropSeashells() drops all carried seashells",
               onObject: "onSeashell() indicates whether there are seashells on the cell",
               onContainer: "onBasket() indicates whether there is a basket on the cell",
               nbWithdrawables: "nbSeashells() indicates how many seashells are on the cell",
               containerSize: "basketSize() indicates how many seashells the basket must hold",
               dropNum: "drop(nbSeashells) drops nbSeashells seashells on the cell",
               withdrawNum: "pick(nbSeashells) picks up nbSeashells seashells from the cell",
               obstacleNorth: "rockNorth() tests whether there is a rock on the cell north of the robot",
               obstacleSouth: "rockSouth() tests whether there is a rock on the cell south of the robot",
               obstacleEast: "rockEast() tests whether there is a rock on the cell east of the robot",
               obstacleWest: "rockWest() tests whether there is a rock on the cell west of the robot"
            },
            messages: {
               emptyBag: "The robot is not carrying a seashell!",
               successContainersFilled: "Congratulations, your robot collected all the seashells!",
               failureContainersFilledLess: "There is still at least one seashell to pick up.",
               failureContainersFilledBag: "Your robot picked up too many seashells.",
               failureDropObject: "Your robot is trying to drop too many seashells in this basket.",
               nothingToPickUp: "No seashell here!",
               obstacle: "The robot is trying to run into a rock.",
               failureReachExit: "The robot did not drop the seashells in the basket."
            }
         },
         nl: {
            label: {
               withdrawObject: "de schelp oprapen",
               dropObject: "de schelpen neerleggen",
               withdrawNum: "%1 schelpen nemen",
               withdrawNum_noShadow: "%1 schelpen nemen",
               dropNum: "%1 schelpen neerleggen",
               dropNum_noShadow: "%1 schelpen neerleggen",
               nbWithdrawables: "aantal schelpen op het vakje",
               containerSize: "grootte van het mandje",
               onObject: "op een schelp",
               onContainer: "op een mandje",
               obstacleNorth: "rots in het noorden",
               obstacleSouth: "rots in het zuiden",
               obstacleEast: "rots in het oosten",
               obstacleWest: "rots in het westen"
            },
            code: {
               withdrawObject: "raapSchelpOp",
               dropObject: "legSchelpenNeer",
               onObject: "opSchelp",
               onContainer: "opMandje",
               nbWithdrawables: "nbSchelpen",
               containerSize: "grootteMandje",
               withdrawNum: "oprapen",
               withdrawNum_noShadow: "oprapen",
               obstacleNorth: "rotsNoord",
               obstacleSouth: "rotsZuid",
               obstacleEast: "rotsOost",
               obstacleWest: "rotsWest"
            },
            description: {
               withdrawObject: "raapSchelpOp() raapt de schelp op die op het vakje ligt",
               dropObject: "legSchelpenNeer() legt alle gedragen schelpen neer",
               onObject: "opSchelp() geeft aan of er een of meer schelpen op het vakje liggen",
               onContainer: "opMandje() geeft aan of er een mandje op het vakje is",
               nbWithdrawables: "nbSchelpen() geeft aan hoeveel schelpen er op het vakje liggen",
               containerSize: "grootteMandje() geeft aan hoeveel schelpen het mandje moet bevatten",
               dropNum: "neerleggen(nbSchelpen) legt nbSchelpen schelpen neer op het vakje",
               withdrawNum: "oprapen(nbSchelpen) raapt nbSchelpen schelpen op van het vakje",
               obstacleNorth: "rotsNoord() test of er een rots op het vakje ten noorden van de robot ligt",
               obstacleSouth: "rotsZuid() test of er een rots op het vakje ten zuiden van de robot ligt",
               obstacleEast: "rotsOost() test of er een rots op het vakje ten oosten van de robot ligt",
               obstacleWest: "rotsWest() test of er een rots op het vakje ten westen van de robot ligt"
            },
            messages: {
               emptyBag: "De robot draagt geen schelp!",
               successContainersFilled: "Bravo, je robot heeft alle schelpen verzameld!",
               failureContainersFilledLess: "Er moet nog minstens één schelp opgeraapt worden.",
               failureContainersFilledBag: "Je robot heeft te veel schelpen opgeraapt.",
               failureDropObject: "Je robot probeert te veel schelpen in dit mandje neer te leggen.",
               nothingToPickUp: "Geen schelp hier!",
               obstacle: "De robot probeert tegen een rots te rijden.",
               failureReachExit: "De robot heeft de schelpen niet in het mandje gelegd."
            }
         },
         de: {
            label: {
               withdrawObject: "die Muschel aufheben",
               dropObject: "die Muscheln ablegen",
               withdrawNum: "%1 Muscheln nehmen",
               withdrawNum_noShadow: "%1 Muscheln nehmen",
               dropNum: "%1 Muscheln ablegen",
               dropNum_noShadow: "%1 Muscheln ablegen",
               nbWithdrawables: "Anzahl der Muscheln auf dem Feld",
               containerSize: "Größe des Korbs",
               onObject: "auf einer Muschel",
               onContainer: "auf einem Korb",
               obstacleNorth: "Fels im Norden",
               obstacleSouth: "Fels im Süden",
               obstacleEast: "Fels im Osten",
               obstacleWest: "Fels im Westen"
            },
            code: {
               withdrawObject: "muschelAufheben",
               dropObject: "muschelnAblegen",
               onObject: "aufMuschel",
               onContainer: "aufKorb",
               nbWithdrawables: "nbMuscheln",
               containerSize: "korbGroesse",
               withdrawNum: "aufheben",
               withdrawNum_noShadow: "aufheben",
               obstacleNorth: "felsNord",
               obstacleSouth: "felsSued",
               obstacleEast: "felsOst",
               obstacleWest: "felsWest"
            },
            description: {
            },
            messages: {
               emptyBag: "Der Roboter trägt keine Muschel!",
               successContainersFilled: "Bravo, dein Roboter hat alle Muscheln gesammelt!",
               failureContainersFilledLess: "Es muss noch mindestens eine Muschel aufgehoben werden.",
               failureContainersFilledBag: "Dein Roboter hat zu viele Muscheln aufgehoben.",
               failureDropObject: "Dein Roboter versucht, zu viele Muscheln in diesen Korb zu legen.",
               nothingToPickUp: "Keine Muschel hier!",
               obstacle: "Der Roboter versucht, gegen einen Felsen zu fahren.",
               failureReachExit: "Der Roboter hat die Muscheln nicht in den Korb gelegt."
            }
         },
      },
      sokoban: {
         fr: {
            label: {
               pushObject: "pousser la caisse",
               onContainer: "sur une case marquée",
               pushableInFront: "caisse devant",
               obstacleInFront: "obstacle devant",
               readNumber: "nombre de la case"
            },
            code: {
               pushObject: "pousserCaisse",
               onContainer: "surCaseMarquee",
               pushableInFront: "caisseDevant",
               obstacleInFront: "obstacleDevant",
               readNumber: "nombreSurCase"
            },
            description: {
               onContainer: "surCaseMarquee() indique si le robot se trouve sur une case marquée",
               pushableInFront: "caisseDevant() indique si le robot est juste devant une caisse",
               pushObject: "pousserCaisse() avance le robot en poussant la caisse qui est devant",               
            },
            messages: {
               successContainersFilled: "Bravo, les caisses sont bien rangées !",
               successContainersFilledSingular: "Bravo, la caisse est bien rangée !",
               failureContainersFilled: "Il y a encore des caisses qui ne sont pas à leur place.",
               failureContainersFilledSingular: "La caisse n'est pas à sa place !",
               failureNothingToPush: "Il n'y a pas de caisse à pousser ici !",
               failureWhilePushing: "Le robot ne peut pas pousser ici !",
               obstacle: "Le robot essaie de foncer dans un mur ou dans une caisse !"
            }
         },

         en: {
            label: {
               pushObject: "push the box",
               onContainer: "on a marked cell",
               pushableInFront: "in front of a box",
               obstacleInFront: "in front of an obstacle",
               readNumber: "number on the cell"
            },
            code: {
               pushObject: "pushBox",
               onContainer: "onMarkedCell",
               pushableInFront: "boxAhead",
               obstacleInFront: "obstacleAhead",
               readNumber: "numberOnCell"
            },   
            messages: {
               successContainersFilled: "Congratulations, the boxes are correctly placed!",
               failureContainersFilled: "There are still boxes that are not places correctly.",
               failureNothingToPush: "There is no box to push here!",
               failureWhilePushing: "The robot can't push here!",
               obstacle: "The robot is trying to move into a wall or a box!"
            }
         },
         nl: {
            label: {
               pushObject: "de kist duwen",
               onContainer: "op een gemarkeerd vakje",
               pushableInFront: "kist voor",
               obstacleInFront: "obstakel voor",
               readNumber: "nummer van het vakje"
            },
            code: {
               pushObject: "duwKist",
               onContainer: "opGemarkeerdVakje",
               pushableInFront: "kistVoor",
               obstacleInFront: "obstakelVoor",
               readNumber: "nummerOpVakje"
            },
            description: {
               onContainer: "opGemarkeerdVakje() geeft aan of de robot op een gemarkeerd vakje staat",
               pushableInFront: "kistVoor() geeft aan of de robot vlak voor een kist staat",
               pushObject: "duwKist() laat de robot vooruitgaan terwijl hij de kist ervoor duwt",
            },
            messages: {
               successContainersFilled: "Bravo, de kisten staan goed!",
               successContainersFilledSingular: "Bravo, de kist staat goed!",
               failureContainersFilled: "Er zijn nog kisten die niet op hun plaats staan.",
               failureContainersFilledSingular: "De kist staat niet op haar plaats!",
               failureNothingToPush: "Er is hier geen kist om te duwen!",
               failureWhilePushing: "De robot kan hier niet duwen!",
               obstacle: "De robot probeert tegen een muur of een kist te rijden!"
            }
         },

         es: {
            label: {
               pushObject: "empujar la caja",
               onContainer: "sobre una casilla marcada",
               pushableInFront: "caja adelante",
               obstacleInFront: "obstáculo adelante",
               readNumber: "número en la casilla"
            },
            code: {
               pushObject: "empujarCaja",
               onContainer: "sobreCasillaMarcada",
               pushableInFront: "cajaAdelante",
               obstacleInFront: "obstáculoAdelante",
               readNumber: "númeroEnCasilla"
            },   
            messages: {
               successContainersFilled: "Bravo, ¡las cajas están bien ordenadas!",
               failureContainersFilled: "Aún hay cajas que no están en su lugar.",
               failureNothingToPush: "¡Aquí no hay caja para empujar!",
               failureWhilePushing: "¡El robot no puede empujar aquí!",
               obstacle: "El robot intenta traspasar un muro o una caja!"
            }
         },
         de: { 
            label: {
               pushObject: "schiebe Kiste",
               onContainer: "auf Markierung",
               pushableInFront: "vor Kiste",
               obstacleInFront: "vor Hindernis",
               readNumber: "lies Zahl" 
            },
            code: {
               pushObject: "schiebeKiste",
               onContainer: "aufMarkierung",
               pushableInFront: "vorKiste",
               obstacleInFront: "vorHindernis",
               readNumber: "liesZahl"
            },
            description: {
            },
            // description: {
            //    onContainer: "aufMarkierung() zeigt an, ob sich der Roboter auf einem markierten Feld befindet",
            //    pushableInFront: "vorKiste() gibt an, ob der Roboter vor einer Kiste steht",
            //    pushObject: "schiebeKiste() schiebt die Kiste ein Feld weiter",               
            // },
            messages: {
               successContainersFilled: "Herzlichen Glückwunsch, die Kisten sind alle auf den Markierungen!",
               successContainersFilledSingular: "Bravo, die Kiste ist richtig platziert!",
               failureContainersFilled: "Es gibt noch Kisten, die nicht an ihrem Platz sind.",
               failureContainersFilledSingular: "Die Kiste steht nicht an ihrem Platz!",
               failureNothingToPush: "Hier gibt es keine Kiste zum Herumschieben!",
               failureWhilePushing: "Der Roboter kann hier nicht schieben!",
               obstacle: "Der Roboter ist gegen ein Hindernis gelaufen!"
            }
         },
      },
      veterinary: {
         fr: {
            label: {
               withdrawObject: "ramasser le bois",
               dropObject: "donner le bois au castor",
               withdrawNum_noShadow: "ramasser %1 bûches",
               dropNum_noShadow: "donner %1 bûches",
               nbWithdrawables: "nombre de bûches sur la case",
               containerSize: "nombre de bûches demandé",
               onObject: "sur du bois",
               onContainer: "chez un castor",
            },
            code: {
               withdrawObject: "ramasserBois",
               dropObject: "donnerBois",
               onObject: "surBois",
               onContainer: "chezCastor",
               nbWithdrawables: "nbBuchesSur",
               containerSize: "nbBuchesADeposer",
            },
            description: {
               withdrawObject: "ramasserBois() ramasse le bois qui se trouve sur la case",
               dropObject: "donnerBois() dépose sur la case le bois transporté",
               onObject: "surBois() indique s'il y a du bois sur la case",
               onContainer: "chezCastor() indique s'il y a un castor sur la case",
               nbWithdrawables: "nbBuchesSur() indique combien de bûches sont sur la case",
               containerSize: "nbBuchesADeposer() indique combien de bûches sont demandées sur la case",
               dropNum: "deposer(nbBuches) dépose nbBuches bûches sur la case",
               withdrawNum: "ramasser(nbBuches) ramasse nbBuches bûches sur la case",
            },
            messages: {
               emptyBag: "Le robot ne porte pas de bois !",
               tooManyObjects: "Le robot porte déjà du bois !",
               successContainersFilled: "Bravo, tous les castors ont du bois. Ils remercient votre robot !",
               failureContainersFilled: "Tout le bois n'a pas été distribué.",
               failureContainersFilledLess: "Il reste du bois à distribuer.",
               failureContainersFilledBag: "Il faut donner le bois au castor !",
               failureDropObject: "Ce castor a déjà du bois.",
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the wood",
               dropObject: "give the wood to the beaver",
               withdrawNum: "pick up %1 logs",
               withdrawNum_noShadow: "pick up %1 logs",
               dropNum: "give %1 logs",
               dropNum_noShadow: "give %1 logs",
               nbWithdrawables: "number of logs on the cell",
               containerSize: "number of logs requested",
               onObject: "on wood",
               onContainer: "at a beaver",
            },
            code: {
               withdrawObject: "pickWood",
               dropObject: "giveWood",
               onObject: "onWood",
               onContainer: "atBeaver",
               nbWithdrawables: "nbLogsOn",
               containerSize: "nbLogsToDrop",
            },
            description: {
               withdrawObject: "pickWood() picks up the wood on the cell",
               dropObject: "giveWood() drops the carried wood on the cell",
               onObject: "onWood() indicates whether there is wood on the cell",
               onContainer: "atBeaver() indicates whether there is a beaver on the cell",
               nbWithdrawables: "nbLogsOn() indicates how many logs are on the cell",
               containerSize: "nbLogsToDrop() indicates how many logs are requested on the cell",
               dropNum: "drop(nbLogs) drops nbLogs logs on the cell",
               withdrawNum: "pick(nbLogs) picks up nbLogs logs from the cell",
            },
            messages: {
               emptyBag: "The robot is not carrying any wood!",
               tooManyObjects: "The robot is already carrying wood!",
               successContainersFilled: "Congratulations, all beavers have wood. They thank your robot!",
               failureContainersFilled: "Not all the wood has been distributed.",
               failureContainersFilledLess: "There is still wood to distribute.",
               failureContainersFilledBag: "You must give the wood to the beaver!",
               failureDropObject: "This beaver already has wood.",
            }
         },
         nl: {
            label: {
               withdrawObject: "het hout oprapen",
               dropObject: "het hout aan de bever geven",
               withdrawNum: "%1 blokken oprapen",
               withdrawNum_noShadow: "%1 blokken oprapen",
               dropNum: "%1 blokken geven",
               dropNum_noShadow: "%1 blokken geven",
               nbWithdrawables: "aantal blokken op het vakje",
               containerSize: "aantal gevraagde blokken",
               onObject: "op hout",
               onContainer: "bij een bever",
            },
            code: {
               withdrawObject: "raapHoutOp",
               dropObject: "geefHout",
               onObject: "opHout",
               onContainer: "bijBever",
               nbWithdrawables: "nbBlokkenOp",
               containerSize: "nbBlokkenTeLeggen",
            },
            description: {
               withdrawObject: "raapHoutOp() raapt het hout op dat op het vakje ligt",
               dropObject: "geefHout() legt het gedragen hout neer op het vakje",
               onObject: "opHout() geeft aan of er hout op het vakje ligt",
               onContainer: "bijBever() geeft aan of er een bever op het vakje is",
               nbWithdrawables: "nbBlokkenOp() geeft aan hoeveel blokken er op het vakje liggen",
               containerSize: "nbBlokkenTeLeggen() geeft aan hoeveel blokken er op het vakje gevraagd worden",
               dropNum: "neerleggen(nbBlokken) legt nbBlokken blokken neer op het vakje",
               withdrawNum: "oprapen(nbBlokken) raapt nbBlokken blokken op van het vakje",
            },
            messages: {
               emptyBag: "De robot draagt geen hout!",
               tooManyObjects: "De robot draagt al hout!",
               successContainersFilled: "Bravo, alle bevers hebben hout. Ze bedanken je robot!",
               failureContainersFilled: "Niet al het hout is uitgedeeld.",
               failureContainersFilledLess: "Er moet nog hout uitgedeeld worden.",
               failureContainersFilledBag: "Je moet het hout aan de bever geven!",
               failureDropObject: "Deze bever heeft al hout.",
            }
         },
         es: {
            label: {
               withdrawObject: "recoger la bola",
               dropObject: "soltar la bola",
               onObject: "sobre una bola",
               onContainer: "sobre un agujero",
            },
            code: {
               withdrawObject: "recogerBola",
               dropObject: "soltarBola",
               onObject: "sobreBola",
               onContainer: "sobreAgujero",
            },   
            messages: {
               emptyBag: "¡El robot no carga ninguna bola!",
               tooManyObjects: "¡El robot ya está cargando una bola!",
               successContainersFilled: "Bravo, ¡el robot ordenó las bolas!",
               failureContainersFilled: "Hay bolas en lugares incorrectos.",
               failureContainersFilledLess: "Aún falta colocar una bola.",
               failureContainersFilledBag: "¡Debe colocar la bola en un agujero!",
            }
         },
         de: {
            label: {
               withdrawObject: "Holzstapel einsammeln",
               dropObject: "Holzstapel übergeben",
               withdrawNum_noShadow: "sammle %1 Holzstapel ein",
               withdrawNum: "sammle %1 Holzstapel ein",
               dropNum_noShadow: "übergebe %1 Holzstapel",
               dropNum: "übergebe %1 Holzstapel",
               nbWithdrawables: "Anzahl Holzstapel",
               containerSize: "Anzahl der bestellten Holzstapel",
               onObject: "auf Holzstapel",
               onContainer: "beim Biber",
               nbInBag: "Anzahl Holzstapel in der Tasche"
            },
            code: {
               withdrawObject: "holzEinsammeln",
               dropObject: "holzUebergeben",
               onObject: "aufHolz",
               onContainer: "beimBiber",
               nbWithdrawables: "anzahlHolzscheite",
               containerSize: "anzahlBestelltesHolz",
               nbInBag: "anzahlHolzscheiteInTasche"
            },
            description: {
            },
            // description: {
            //    withdrawObject: "holzEinsammeln() sammelt alles Holz auf dem Feld",
            //    dropObject: "holzUebergeben() legt einen Holzscheit auf dem Feld ab",
            //    onObject: "aufHolz() zeigt an, ob sich Holz auf dem Feld befindet",
            //    onContainer: "beimBiber() zeigt an, ob sich ein Biber auf dem Feld befindet",
            //    nbWithdrawables: "anzahlHolzscheite() gibt an, wie viele Holzscheite sich auf dem Feld befinden",
            //    containerSize: "anzahlBestelltesHolz() gibt an, wie viele Holzscheite der Biber bestellt hat",
            //    dropNum: "übergebe(Anzahl) überreicht dem Biber Anzahl Holzscheite",
            //    withdrawNum: "sammle(Anzahl) sammelt Anzahl Holzscheite ein",
            //    nbInBag: "anzahlHolzscheiteInTasche() gibt die Anzahl der Holzscheite zurück, die der Roboter in diesem Moment bei sich trägt"
            // },
            messages: {
               emptyBag: "Der Roboter trägt kein Holz bei sich!",
               tooManyObjects: "Der Roboter kann nicht so viele Holzstapel auf einmal tragen.",
               successContainersFilled: "Bravo, die Holzstapel wurden übergeben!",
               failureContainersFilled: "Es wurden nicht alle Holzstapel richtig übergeben.",
               failureContainersFilledLess: "Es gibt noch Holzstapel zu übergeben.",
               failureContainersFilledBag: "Der Roboter hat zu viele Holzstapel eingesammelt.",
               failureDropObject: "Dieser Biber hat nicht so viele Holzstapel bestellt.",
            }
         },
      },
      wiring: {
         de: {
            messages: {
               successPlugsWired: "Super, alles wurde korrekt angeschlossen!",
               failurePlugsWired: "Die Verkabelung ist so noch nicht korrekt.",
            }
         },
      },
   };
   
   var contextParams = {
      none: {
         hideSaveOrLoad: true,
         actionDelay: 200,
         ignoreInvalidMoves: false,
         checkEndEveryTurn: false,
         cellSide: 60
      },
      labyrinth: {
         newBlocks: [
            {
               name: "onExit",
               strings: {
                  de: {
                     label: "Flagge erobert",
                     code: "flaggeErobert",
                     // description: "flaggeErobert(): steht der Roboter auf dem Feld der roten Flagge?"
                  },
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onExit",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) { return (obj.isExit === true); }));
               }
            }
         ],
         backgroundColor: "#c5b6af",
         borderColor: "#888888",
         //hasGravity: true, //Cannot move up if this thing is on
         bagSize: 1,
         containerSize: 1,
         itemTypes: {
            robot: { img: imgPath+"pink_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, offsetY: 3, zOrder: 3 },
            obstacle: { num: 2, img: imgPath+"grey_brick_wall.png", side: 60, isObstacle: true, zOrder: 0 },
            obstacle_small: { num: 4, img: imgPath+"grey_brick_wall_small.png", side: 60, isObstacle: true, zOrder: 0 },
            flag: { num: 3, img: imgPath+"flag.png", side: 60, isExit: true, zOrder: 0},
            number: { num: 5, side: 60, zOrder: 1 },
         },
         checkEndCondition: robotEndConditions.checkReachExit
      },
      arrows: {
         newBlocks: [
            {
               name: "onRightArrow",
               strings: {
                  fr: {
                     label: "sur une flèche vers la droite",
                     code: "surFlecheDroite",
                     description: "surFlecheDroite(): Le robot est-il sur une flèche vers la droite ?"
                  },
                  en: {
                     label: "on a right arrow",
                     code: "onRightArrow",
                     description: "onRightArrow(): Is the robot on a right arrow?"
                  },
                  nl: {
                     label: "op een pijl naar rechts",
                     code: "opPijlRechts",
                     description: "opPijlRechts(): Staat de robot op een pijl naar rechts?"
                  },
                  es: {
                     label: "sobre una flecha hacia la derecha",
                     code: "sobreFlechaHaciaLaDerecha",
                     description: "sobreFlechaHaciaLaDerecha(): ¿Se encuentra el robot sobre una flecha hacia la derecha?"
                  },
                  de: {
                     label: "auf Pfeil nach rechts",
                     code: "aufPfeilNachRechts",
                     // description: "aufPfeilNachRechts(): Befindet sich der Roboter auf einem Pfeil nach rechts?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onRightArrow",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.forwardsRight===true;}));
               }
            },
            {
               name: "onLeftArrow",
               strings: {
                  fr: {
                     label: "sur une flèche vers la gauche",
                     code: "surFlecheGauche",
                     description: "surFlecheGauche(): Le robot est-il sur une flèche vers la gauche ?"
                  },
                  en: {
                     label: "on a left arrow",
                     code: "onLeftArrow",
                     description: "onLeftArrow(): Is the robot on a left arrow?"
                  },
                  nl: {
                     label: "op een pijl naar links",
                     code: "opPijlLinks",
                     description: "opPijlLinks(): Staat de robot op een pijl naar links?"
                  },

                  es: {
                     label: "sobre una flecha hacia la izquierda",
                     code: "sobreFlechaHaciaLaIzquierda",
                     description: "sobreFlechaHaciaLaIzquierda(): ¿Se encuentra el robot sobre una flecha hacia la izquierda?"
                  },
                  de: {
                     label: "auf Pfeil nach links",
                     code: "aufPfeilNachLinks",
                     // description: "aufPfeilNachLinks(): Befindet sich der Roboter auf einem Pfeil nach links?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onLeftArrow",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.forwardsLeft===true;}));
               }
            },
            {
               name: "onTopArrow",
               strings: {
                  fr: {
                     label: "sur une flèche vers le haut",
                     code: "surFlecheHaut",
                     description: "surFlecheHaut(): Le robot est-il sur une flèche vers le haut ?"
                  },
                  en: {
                     label: "on an up arrow",
                     code: "onUpArrow",
                     description: "onUpArrow(): Is the robot on an up arrow?"
                  },
                  nl: {
                     label: "op een pijl naar boven",
                     code: "opPijlBoven",
                     description: "opPijlBoven(): Staat de robot op een pijl naar boven?"
                  },

                  es: {
                     label: "sobre una flecha hacia arriba",
                     code: "sobreFlechaHaciaArriba",
                     description: "sobreFlechaHaciaArriba(): ¿Se encuentra el robot sobre una flecha hacia arriba?"
                  },

                  de: {
                     label: "auf Pfeil nach oben",
                     code: "aufPfeilNachOben",
                     // description: "aufPfeilNachOben(): Befindet sich der Roboter auf einem Pfeil nach oben?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onTopArrow",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.forwardsTop===true;}));
               }
            },
            {
               name: "onBottomArrow",
               strings: {
                  fr: {
                     label: "sur une flèche vers le bas",
                     code: "surFlecheBas",
                     description: "surFlecheBas(): Le robot est-il sur une flèche vers le bas ?"
                  },
                  en: {
                     label: "on a down arrow",
                     code: "onDownArrow",
                     description: "onDownArrow(): Is the robot on a down arrow?"
                  },
                  nl: {
                     label: "op een pijl naar beneden",
                     code: "opPijlBeneden",
                     description: "opPijlBeneden(): Staat de robot op een pijl naar beneden?"
                  },

                  es: {
                     label: "sobre una flecha hacia abajo",
                     code: "sobreFlechaHaciaAbajo",
                     description: "sobreFlechaHaciaAbajo(): ¿Se encuentra el robot sobre una flecha hacia abajo?"
                  },

                  de: {
                     label: "auf Pfeil nach unten",
                     code: "aufPfeilNachUnten",
                     // description: "aufPfeilNachUnten(): Befindet sich der Roboter auf einem Pfeil nach unten?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onBottomArrow",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.forwardsBottom===true;}));
               }
            },
            {
               name: "onArrow",
               strings: {
                  de: {
                     label: "auf Pfeil",
                     code: "aufPfeil",
                     // description: "aufPfeil(): Befindet sich der Roboter auf einem Pfeil?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onArrow",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isArrow===true;}));
               }
            },
            {
               name: "arrowGetDirection",
               type: "sensors",
               category: "robot",
               strings: {
                  de: {
                     label: "Pfeilrichtung",
                     code: "pfeilrichtung",
                     // description: "pfeilrichtung(): In welche Richtung zeigt der Pfeil?"
                  }
               },
               block: { name: "arrowGetDirection", yieldsValue: true, blocklyJson: {output: "string"} },
               func: function(callback) {
                  var right = this.isOn(function(obj) {return obj.forwardsRight===true;})
                  var left = this.isOn(function(obj) {return obj.forwardsLeft===true;})
                  var top = this.isOn(function(obj) {return obj.forwardsTop===true;})
                  var bottom = this.isOn(function(obj) {return obj.forwardsBottom===true;})
                  if(right){this.callCallback(callback, 'rechts');}
                  if(left){this.callCallback(callback, 'links');}
                  if(top){this.callCallback(callback, 'oben');}
                  if(bottom){this.callCallback(callback, 'unten');}
               }
            }
         ],
         backgroundColor: "#d3e7b6",
         bagInit: {
            count: 200,
            type: "paint"
          },
         ignoreBag: true,
         itemTypes: {
            robot: { img: imgPath+"blue_robot.png", side: 90, nbStates: 1, isRobot: true, offsetX: -15, offsetY: 15, zOrder: 2 },
            cell: {num: 1, color: "#d3e7b6", side: 60, isObstacle: true, zOrder: 0 },
            box: { num: 3, img: imgPath+"chest.png", side: 80, isExit: true, zOrder: 1, offsetX: -10, offsetY: 5 },
            leftArrow: { num: 4, img: imgPath+"leftArrow.png", isArrow:true, side: 60, forwardsLeft: true, zOrder: 0},
            rightArrow: { num: 5, img: imgPath+"rightArrow.png", isArrow:true, side: 60, forwardsRight: true, zOrder: 0},
            topArrow: { num: 6, img: imgPath+"topArrow.png",isArrow:true,  side: 60, forwardsTop: true, zOrder: 0},
            bottomArrow: { num: 7, img: imgPath+"bottomArrow.png", isArrow:true, side: 60, forwardsBottom: true, zOrder: 0},
            marker: { num: 2, img: imgPath+"paint_marker.png", side: 60, isContainer: true, containerFilter: function(item) {return item.type === "paint";}, zOrder: 0 },
            paint: { img: imgPath+"paint.png", side: 60, isWithdrawable: true, isColor: true, zOrder: 1 },
         },
         checkEndCondition: robotEndConditions.checkReachExit
      },
      arrows_straight: {
         newBlocks: [
            {
               name: "arrowInFront",
               strings: {
                  de: {
                     label: "Pfeil vorne",
                     code: "pfeilVorne",
                     // description: "pfeilVorne(): Befindet sich vor vom Roboter ein Pfeil?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "arrowInFront",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isInFront(function(obj) { return obj.isArrow === true; }));
               }
            },
            {
               name: "arrowLeft",
               strings: {
                  de: {
                     label: "Pfeil links",
                     code: "pfeilLinks",
                     // description: "pfeilLinks(): Befindet sich links vom Roboter ein Pfeil?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "arrowLeft",
                  yieldsValue: true
               },
               func: function(callback) {
                  var robot = this.getRobot();
                  var coords = this.coordsInFront(3);
                  this.callCallback(callback, this.hasOn(coords.row, coords.col, function(obj) { return obj.isArrow === true; }));
               }
            },
            {
               name: "arrowRight",
               strings: {
                  de: {
                     label: "Pfeil rechts",
                     code: "pfeilRechts",
                     // description: "pfeilRechts(): Befindet sich rechts vom Roboter ein Pfeil?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "arrowRight",
                  yieldsValue: true
               },
               func: function(callback) {
                  var robot = this.getRobot();
                  var coords = this.coordsInFront(1);
                  this.callCallback(callback, this.hasOn(coords.row, coords.col, function(obj) { return obj.isArrow === true; }));
               }
            },
            {
               name: "onRightArrow",
               strings: {
                  de: {
                     label: "auf Pfeil nach rechts",
                     code: "aufPfeilNachRechts",
                     // description: "aufPfeilNachRechts(): Befindet sich der Roboter auf einem Pfeil nach rechts?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onRightArrow",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.forwardsRight===true;}));
               }
            },
            {
               name: "onLeftArrow",
               strings: {
                  de: {
                     label: "auf Pfeil nach links",
                     code: "aufPfeilNachLinks",
                     // description: "aufPfeilNachLinks(): Befindet sich der Roboter auf einem Pfeil nach links?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onLeftArrow",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.forwardsLeft===true;}));
               }
            },
            {
               name: "onTopArrow",
               strings: {
                  de: {
                     label: "auf Pfeil nach oben",
                     code: "aufPfeilNachOben",
                     // description: "aufPfeilNachOben(): Befindet sich der Roboter auf einem Pfeil nach oben?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onTopArrow",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.forwardsTop===true;}));
               }
            },
            {
               name: "onBottomArrow",
               strings: {
                  de: {
                     label: "auf Pfeil nach unten",
                     code: "aufPfeilNachUnten",
                     // description: "aufPfeilNachUnten(): Befindet sich der Roboter auf einem Pfeil nach unten?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onBottomArrow",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.forwardsBottom===true;}));
               }
            },
            {
               name: "onArrow",
               strings: {
                  de: {
                     label: "auf Pfeil",
                     code: "aufPfeil",
                     // description: "aufPfeil(): Befindet sich der Roboter auf einem Pfeil?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onArrow",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isArrow===true;}));
               }
            },
            {
               name: "arrowGetDirection",
               type: "sensors",
               category: "robot",
               strings: {
                  de: {
                     label: "Pfeilrichtung",
                     code: "pfeilrichtung",
                     // description: "pfeilrichtung(): In welche Richtung zeigt der Pfeil?"
                  }
               },
               block: { name: "arrowGetDirection", yieldsValue: true, blocklyJson: {output: "string"} },
               func: function(callback) {
                  var right = this.isOn(function(obj) {return obj.forwardsRight===true;})
                  var left = this.isOn(function(obj) {return obj.forwardsLeft===true;})
                  var top = this.isOn(function(obj) {return obj.forwardsTop===true;})
                  var bottom = this.isOn(function(obj) {return obj.forwardsBottom===true;})
                  if(right){this.callCallback(callback, 'rechts');}
                  if(left){this.callCallback(callback, 'links');}
                  if(top){this.callCallback(callback, 'oben');}
                  if(bottom){this.callCallback(callback, 'unten');}
               }
            }
         ],
         backgroundColor: "#e6e6fa",
         bagInit: {
            count: 200,
            type: "paint"
          },
         ignoreBag: true,
         itemTypes: {
            robot: { img: imgPath+"blue_robot.png", side: 80, nbStates: 1, isRobot: true, offsetX: -10, offsetY: 10, zOrder: 2 },
            box: { num: 3, img: imgPath+"chest.png", side: 80, isExit: true, zOrder: 1, offsetX: -10, offsetY: 5 },
            leftArrow: { num: 4, img: imgPath+"leftArrow.png", side: 60, forwardsLeft: true, isArrow: true, zOrder: 0},
            rightArrow: { num: 5, img: imgPath+"rightArrow.png", side: 60, forwardsRight: true, isArrow: true, zOrder: 0},
            topArrow: { num: 6, img: imgPath+"topArrow.png", side: 60, forwardsTop: true, isArrow: true, zOrder: 0},
            bottomArrow: { num: 7, img: imgPath+"bottomArrow.png", side: 60, forwardsBottom: true, isArrow: true, zOrder: 0},
            marker: { num: 2, img: imgPath+"paint_marker.png", side: 60, isContainer: true, containerFilter: function(item) {return item.type === "paint";}, zOrder: 0 },
            paint: { img: imgPath+"paint.png", side: 60, isWithdrawable: true, isColor: true, zOrder: 1 },
         },
         checkEndCondition: robotEndConditions.checkReachExit
      },
      cards: {
         newBlocks: [
            {
               name: "onRound",
               strings: {
                  fr: {
                     label: "rond sur la carte",
                     code: "rondCarte",
                     description: "rondCarte(): Le robot est-il sur une carte qui contient un rond ?"
                  },
                  en: {
                     label: "circle on the card",
                     code: "circleOnCard",
                     description: "circleOnCard(): Is the robot on a card that contains a circle?"
                  },
                  nl: {
                     label: "rondje op de kaart",
                     code: "rondjeKaart",
                     description: "rondjeKaart(): Staat de robot op een kaart met een rondje?"
                  },

                  es: {
                     label: "círculo sobre la carta",
                     code: "círculoCarta",
                     description: "círculoCarta(): ¿está el robot sobre una carta que contiene un círculo?"
                  },

                  de: {
                     label: "auf Kreis",
                     code: "aufKreis",
                     // description: "aufKreis(): Befindet sich der Roboter auf einem Feld mit einem Kreis?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onRound",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  // if(!this.isOn(function(obj) {return obj.isWithdrawable===true || obj.isContainer===true;}))
                  //    throw(strings.messages.nothingToLookAt);
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isRound===true;}));
               }
            },
            {
               name: "onSquare",
               strings: {
                  fr: {
                     label: "carré sur la carte",
                     code: "carreCarte",
                     description: "carreCarte(): Le robot est-il sur une carte qui contient un carré ?"
                  },
                  en: {
                     label: "square on the card",
                     code: "squareOnCard",
                     description: "squareOnCard(): Is the robot on a card that contains a square?"
                  },
                  nl: {
                     label: "vierkant op de kaart",
                     code: "vierkantKaart",
                     description: "vierkantKaart(): Staat de robot op een kaart met een vierkant?"
                  },
                  es: {
                     label: "cuadrado sobre la carta",
                     code: "cuadradoCarta",
                     description: "cuadradoCarta(): ¿está el robot sobre una carta que contiene un cuadrado?"
                  },
                  de: {
                     label: "auf Quadrat",
                     code: "aufQuadrat",
                     // description: "aufViereck(): Befindet sich der Roboter auf einem Feld mit einem Viereck?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onSquare",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  // if(!this.isOn(function(obj) {return obj.isWithdrawable===true || obj.isContainer===true;}))
                  //    throw(strings.messages.nothingToLookAt);
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isSquare===true;}));
               }
            },
            {
               name: "onTriangle",
               strings: {
                  fr: {
                     label: "triangle sur la carte",
                     code: "triangleCarte",
                     description: "rondCarte(): Le robot est-il sur une carte qui contient un triangle ?"
                  },
                  en: {
                     label: "triangle on the card",
                     code: "triangleOnCard",
                     description: "triangleOnCard(): Is the robot on a card that contains a triangle?"
                  },
                  nl: {
                     label: "driehoek op de kaart",
                     code: "driehoekKaart",
                     description: "driehoekKaart(): Staat de robot op een kaart met een driehoek?"
                  },
                  es: {
                     label: "triángulo sobre la carta",
                     code: "triánguloCarta",
                     description: "triánguloCarta(): ¿está el robot sobre una carta que contiene un triángulo?"
                  },
                  de: {
                     label: "auf Dreieck",
                     code: "aufDreieck",
                     // description: "aufDreieck(): Befindet sich der Roboter auf einem Feld mit einem Dreieck?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onTriangle",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  // if(!this.isOn(function(obj) {return obj.isWithdrawable===true || obj.isContainer===true;}))
                  //    throw(strings.messages.nothingToLookAt);
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isTriangle===true;}));
               }
            },
            {
               name: "onQuadrille",
               strings: {
                  fr: {
                     label: "sur un motif quadrillé",
                     code: "surQuadrille",
                     description: "surQuadrille(): Le robot est-il sur une carte quadrillée ?"
                  },
                  en: {
                     label: "on a checkered pattern",
                     code: "onCheckered",
                     description: "onCheckered(): Is the robot on a checkered card?"
                  },
                  nl: {
                     label: "op een geruit motief",
                     code: "opGeruit",
                     description: "opGeruit(): Staat de robot op een geruite kaart?"
                  },
                  es: {
                     label: "patrón cuadriculado",
                     code: "sobreCudarícula",
                     description: "sobreCudarícula(): ¿Está el robot sobre una carta cuadriculada?"
                  },
                  de: {
                     label: "auf Gittermuster",
                     code: "aufGittermuster",
                     // description: "aufGittermuster(): Befindet sich der Roboter auf einem Feld mit Gittermuster?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onQuadrille",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  // if(!this.isOn(function(obj) {return obj.isWithdrawable===true || obj.isContainer===true;}))
                  //    throw(strings.messages.nothingToLookAt);
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isQuadrille===true;}));
               }
            },
            {
               name: "onStriped",
               strings: {
                  fr: {
                     label: "sur un motif rayé",
                     code: "surRaye",
                     description: "surRaye(): Le robot est-il sur une carte rayée ?"
                  },
                  en: {
                     label: "on a striped pattern",
                     code: "onStriped",
                     description: "onStriped(): Is the robot on a striped card?"
                  },
                  nl: {
                     label: "op een gestreept motief",
                     code: "opGestreept",
                     description: "opGestreept(): Staat de robot op een gestreepte kaart?"
                  },
                  es: {
                     label: "patrón rayado",
                     code: "sobreRayado",
                     description: "sobreRayado(): ¿Está el robot sobre una carta rayada?"
                  },
                  de: {
                     label: "auf Streifen",
                     code: "aufStreifen",
                     // description: "aufStreifen(): Befindet sich der Roboter auf einem Feld mit Streifen?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onStriped",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  // if(!this.isOn(function(obj) {return obj.isWithdrawable===true || obj.isContainer===true;}))
                  //    throw(strings.messages.nothingToLookAt);
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isStriped===true;}));
               }
            },
            {
               name: "onDotted",
               strings: {
                  fr: {
                     label: "sur un motif à pois",
                     code: "surPois",
                     description: "surPois(): Le robot est-il sur une carte à pois ?"
                  },
                  en: {
                     label: "on a dotted pattern",
                     code: "onDotted",
                     description: "onDotted(): Is the robot on a dotted card?"
                  },
                  nl: {
                     label: "op een gestippeld motief",
                     code: "opGestippeld",
                     description: "opGestippeld(): Staat de robot op een gestippelde kaart?"
                  },
                  es: {
                     label: "patrón con puntos",
                     code: "sobrePuntos",
                     description: "sobrePuntos(): ¿Está el robot sobre una carta con puntos?"
                  },
                  de: {
                     label: "auf Punkten",
                     code: "aufPunkten",
                     // description: "aufPunkten(): Befindet sich der Roboter auf einem Feld mit Punkten?"
                  }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onDotted",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  // if(!this.isOn(function(obj) {return obj.isWithdrawable===true || obj.isContainer===true;}))
                  //    throw(strings.messages.nothingToLookAt);
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isDotted===true ;}));
               }
            }
         ],
         bagSize: 1,
         backgroundColor: "#e5efef",
         itemTypes: {
            robot: { img: imgPath+"red_robot.png", side: 90, nbStates: 1, isRobot: true, offsetX: -15, offsetY: 15, zOrder: 2 },
            square: { num: 2, img: imgPath+"square_empty.png", side: 60, isContainer: true, containerFilter: function(obj) { return obj.isSquare === true; }, zOrder: 0 },
            round: { num: 3, img: imgPath+"round_empty.png", side: 60, isContainer: true, containerFilter: function(obj) { return obj.isRound === true; }, zOrder: 0 },
            triangle: { num: 4, img: imgPath+"triangle_empty.png", side: 60, isContainer: true, containerFilter: function(obj) { return obj.isTriangle === true; }, zOrder: 0 },
            dotted: { num: 5, img: imgPath+"dotted.png", side: 60, isContainer: true, containerFilter: function(obj) { return obj.isDotted === true; }, zOrder: 0 },
            striped: { num: 6, img: imgPath+"striped.png", side: 60, isContainer: true, containerFilter: function(obj) { return obj.isStriped === true; }, zOrder: 0 },
            quadrille: { num: 7, img: imgPath+"quadrille.png", side: 60, isContainer: true, containerFilter: function(obj) { return obj.isQuadrille === true; }, zOrder: 0 },
            roundQuadrille: {num: 10, img: imgPath+"card_roundQuadrille.png", side: 60, isWithdrawable: true, isRound: true, isQuadrille: true, zOrder: 1 },
            squareQuadrille: { num: 11,img: imgPath+"card_squareQuadrille.png", side: 60, isWithdrawable: true, isSquare: true, isQuadrille: true, zOrder: 1 },
            triangleQuadrille: {num: 12, img: imgPath+"card_triangleQuadrille.png", side: 60, isWithdrawable: true, isTriangle: true, isQuadrille: true, zOrder: 1 },
            roundStriped: {num: 13, img: imgPath+"card_roundStriped.png", side: 60, isWithdrawable: true, isRound: true, isStriped: true, zOrder: 1 },
            squareStriped: {num: 14, img: imgPath+"card_squareStriped.png", side: 60, isWithdrawable: true, isSquare: true, isStriped: true, zOrder: 1 },
            triangleStriped: {num: 15, img: imgPath+"card_triangleStriped.png", side: 60, isWithdrawable: true, isTriangle: true, isStriped: true, zOrder: 1 },
            roundDotted: {num: 16, img: imgPath+"card_roundDotted.png", side: 60, isWithdrawable: true, isRound: true, isDotted: true, zOrder: 1 },
            squareDotted: { num: 17,img: imgPath+"card_squareDotted.png", side: 60, isWithdrawable: true, isSquare: true, isDotted: true, zOrder: 1 },
            triangleDotted: {num: 18, img: imgPath+"card_triangleDotted.png", side: 60, isWithdrawable: true, isTriangle: true, isDotted: true, zOrder: 1 }
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      castle: {
         backgroundColor: "#1f003c",
         borderColor: "#888888",
         hasGravity: true,
         bagSize: 1,
         containerSize: 1,
         itemTypes: {
            robot: { img: imgPath+"castle_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, offsetY: 3, zOrder: 3 },
            platform: { num: 2, img: imgPath+"platform.png", side: 60, isObstacle: true, zOrder: 0 },
            hearth: { num: 4, img: imgPath+"hearth.png", side: 60, isContainer: true, zOrder: 1},
            wood: { num:5, img: imgPath+"firewood.png", side: 60, isWithdrawable: true, zOrder: 2},
            wall: { num: 6, img: imgPath+"grey_brick_wall.png", side: 60, isObstacle: true, zOrder: 0 },
            // projectile: {num: 6, img: "projectile.png", side: 60, zOrder: 4, action: function(item, time) { this.moveProjectile(item); }, isProjectile: true},
            // door: { num: 8, img: imgPath+"door.png", side: 60, isExit: true, zOrder: 1},
            // dispersion: {img: "dispersion.png", side: 60, zOrder: 4, action: function(item, time) { this.destroy(item); }, isProjectile: true},
            // dispersion_robot: {img: "dispersion.png", side: 60, zOrder: 4, offsetY: -15, action: function(item, time) { this.destroy(item); }, isProjectile: true},
            // projectile_generator: {num: 7, side: 60, action: function(item, time) {
            //    if(item.period == undefined)
            //       item.period = 1;
            //    if(item.start == undefined)
            //       item.start = 1;
            //    if(time % item.period == item.start) 
            //       this.dropObject({type: "projectile"}, {row: item.row, col: item.col}); 
            // }}
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      chticode_abs: {
         itemTypes: {
            robot: { img: "red_robot.png", side: 90, nbStates: 1, isRobot: true, offsetX: -15, offsetY: 15, zOrder: 2 },
            obstacle: { num: 2, img: "obstacle.png", side: 60, isObstacle: true },
            green: { num: 3, color: "#b5e61d", side: 60, isExit: true, zOrder: 0 },
            gem: { num: 4, img: "gem.png", side: 60, isWithdrawable: true, autoWithdraw: true, zOrder: 1 },
            north: { num: 5, img: "north.png", side: 60, zOrder: 0 },
            south: { num: 6, img: "south.png", side: 60, zOrder: 0 },
            east: { num: 7, img: "east.png", side: 60, zOrder: 0 },
            west: { num: 8, img: "west.png", side: 60, zOrder: 0 },
         },
         checkEndCondition: robotEndConditions.checkBothReachAndCollect
      },
      chticode_rel: {
         itemTypes: {
            robot: { img: "green_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -14, zOrder: 2 },
            obstacle: { num: 2, img: "obstacle.png", side: 60, isObstacle: true },
            green: { num: 3, color: "#b5e61d", side: 60, isExit: true},
            gem: { num: 4, img: "gem.png", side: 60, isWithdrawable: true, autoWithdraw: true, zOrder: 1 }
         },
         checkEndCondition: robotEndConditions.checkReachExit
      },
      cones: {
         newBlocks: [
            {
               name: "onExit",
               strings: {
                  de: {
                     label: "Ausgang erreicht",
                     code: "ausgangErreicht",
                     // description: "ausgangErreicht(): steht der Roboter auf dem Feld mit dem Ausgang?"
                  },
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onExit",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) { return (obj.isExit === true); }));
               }
            }
         ],
         bagInit: {
           count: 200,
           type: "cone"
         },
         backgroundColor: "#f9f9c1",
         itemTypes: {
            robot: { img: imgPath+"pink_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -20, zOrder: 2 },
            marker: { num: 2, img: imgPath+"cones_marker.png", side: 60, isContainer: true, zOrder: 0 },
            cone: { num: 3, img: imgPath+"cone.png", side: 60, isWithdrawable: true, isObstacle: true, zOrder: 1 },
            contour: { num: 4, img: imgPath+"contour.png", side: 60, zOrder: 1 },
            fixed_cone: { num: 5, img: imgPath+"cone.png", side: 60, isObstacle: true, zOrder: 1 },
            number: { num: 6, side: 60, zOrder: 1 },
            exit: {num: 7, img: imgPath+"flag.png", side: 60, isExit: true},
            wall: { num: 8, img: imgPath+"grey_brick_wall.png", side: 60, isObstacle: true, zOrder: 0 },
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      course: {
         backgroundColor: "#d4e8c4", // "#e7d0bc",
         borderColor: "#49b675",
         itemTypes: {
            board_background: { num: 90, color: "#d3d3d3", side: 60, zOrder: 0 },
            board: { num: 91, side: 60, isWritable: true, zOrder: 1, isNumber: true, isBoard: true },
            board_notwritable: { num: 92, side: 60, zOrder: 1, isNumber: true },
            robot: { img: imgPath+"red_robot.png", side: 70, nbStates: 1, offsetX: -5, offsetY: 5, isRobot: true, zOrder: 2 },
            bush: { num: 2, img: imgPath+"bush.png", side: 60, isObstacle: true, zOrder: 0 },
            flag: { num: 3, img: imgPath+"flag.png", side: 60, isExit: true, zOrder: 0},
            wall: { num: 4, img: imgPath+"grey_brick_wall.png", side: 60, isObstacle: true, zOrder: 0 },
            number: { num: 5, side: 60, zOrder: 1 },
            horizontal_closed_door: { num: 7, img:  imgPath+"horizontal_closed_door.png", side: 60, isObstacle: true, zOrder: 1 },
            vertical_closed_door: { num: 8, img:  imgPath+"vertical_closed_door.png", side: 60, isObstacle: true, zOrder: 1 },
            horizontal_open_door: { num: 11, img:  imgPath+"horizontal_open_door.png", side: 60, zOrder: 1},
            vertical_open_door: { num: 12, img:  imgPath+"vertical_open_door.png", side: 60, zOrder: 1},
            water: { num: 13, img: imgPath+"water.png", side: 60, isObstacle: true, zOrder: 1 },
            water_full: { num: 17, img: imgPath+"water_full.png", side: 60, isObstacle: true, zOrder: 1 },
            tree: { num: 15, img: imgPath+"tree.png", side: 80, isObstacle: true, zOrder: 2, offsetX: -15, offsetY: 8 },
            flowers: { num: 16, img: imgPath+"flowers.png", side: 50, isObstacle: true, zOrder: 1, offsetX: 5 },
            bridge: { num: 14, img: imgPath+"water+board.png", side: 60, zOrder: 1 }
         },
         checkEndCondition: robotEndConditions.checkReachExit
      },
      dominoes: {
         newBlocks: [
           {
             name: "onCross",
             strings: {
               fr: {
                 label: "sur croix",
                 code: "surCroix",
                 description: "surCroix(): Le robot est-il sur une croix ?"
               },
               en: {
                     label: "on a cross",
                     code: "onCross",
                     description: "onCross(): Is the robot on a cross?"
                  },
               nl: {
                     label: "op een kruis",
                     code: "opKruis",
                     description: "opKruis(): Staat de robot op een kruis?"
                  },
               es: {
                 label: "sobre cruz",
                 code: "sobreCruz",
                 description: "sobreCruz(): ¿Se encuentra el robot sobre una cruz?"
               },
               de: {
                  label: "auf grünem Kreuz",
                  code: "aufKreuz",
                  // description: "aufKreuz(): Steht der Roboter über einem Kreuz?"
                }
             },
             category: "robot",
             type: "sensors",
             block: {
                  name: "onCross",
                  yieldsValue: 'bool'
               },
             func: function(callback) {
               this.callCallback(callback, this.isOn(function(obj) {return obj.isCross===true;}));
             }
           },
           {
             name: "onStar",
             strings: {
               fr: {
                 label: "sur étoile",
                 code: "surEtoile",
                 description: "surEtoile(): Le robot est-il sur une étoile ?"
               },
               en: {
                     label: "on a star",
                     code: "onStar",
                     description: "onStar(): Is the robot on a star?"
                  },
               nl: {
                     label: "op een ster",
                     code: "opSter",
                     description: "opSter(): Staat de robot op een ster?"
                  },
               es: {
                 label: "sobre estrella",
                 code: "sobreEstrella",
                 description: "sobreEstrella(): ¿Se encuentra el robot sobre una estrella?"
               },
               de: {
                  label: "auf gelbem Stern",
                  code: "aufStern",
                  // description: "aufStern(): Steht der Roboter über einem Stern?"
                }
             },
             category: "robot",
             type: "sensors",
             block: {
                  name: "onStar",
                  yieldsValue: 'bool'
               },
             func: function(callback) {
               this.callCallback(callback, this.isOn(function(obj) {return obj.isStar===true;}));
             }
           },
           {
             name: "onSquare",
             strings: {
               fr: {
                 label: "sur carré",
                 code: "surCarre",
                 description: "surCarre(): Le robot est-il sur du bleu ?"
               },
               en: {
                     label: "on a square",
                     code: "onSquare",
                     description: "onSquare(): Is the robot on a square?"
                  },
               nl: {
                     label: "op een vierkant",
                     code: "opVierkant",
                     description: "opVierkant(): Staat de robot op een vierkant?"
                  },
               es: {
                 label: "sobre cuadrado",
                 code: "sobreCuadrado",
                 description: "sobreCuadrado(): ¿Se encuentra el robot sobre un cuadrado?"
               },
               de: {
                  label: "auf blauem Quadrat",
                  code: "aufQuadrat",
                  // description: "aufViereck(): Steht der Roboter über einem Viereck?"
                }
             },
             category: "robot",
             type: "sensors",
             block: {
                  name: "onSquare",
                  yieldsValue: 'bool'
               },
             func: function(callback) {
               this.callCallback(callback, this.isOn(function(obj) {return obj.isSquare===true;}));
             }
           },
           {
               name: "onTriangle",
               strings: {
                  fr: {
                     label: "sur triangle",
                     code: "surTriangle",
                     description: "surTriangle(): Le robot est-il sur un triangle ?"
                  },
                  en: {
                     label: "on a triangle",
                     code: "onTriangle",
                     description: "onTriangle(): Is the robot on a triangle?"
                  },
                  nl: {
                     label: "op een driehoek",
                     code: "opDriehoek",
                     description: "opDriehoek(): Staat de robot op een driehoek?"
                  },
                  de: {
                     label: "auf einem Dreieck",
                     code: "aufDreieck",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onTriangle",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isTriangle===true;}));
               }
            }
         ],
         noBorders: false,
         backgroundColor: "#C4E0FF",
         borderColor: "#675B6E",
         itemTypes: {
            //green_robot: { img: imgPath+"green_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            pink_robot: { img: imgPath+"pink_robot_above.png", side: 70, nbStates: 9, isRobot: true, offsetX: -5, offsetY: 5, zOrder: 2 },
            robot: { img: imgPath+"pink_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            contour: { num: 2, img: imgPath+"contour.png", side: 60, zOrder: 0 },
            GG: { num: 3, img: imgPath+"GG.png", side: 60, isWithdrawable: true, isCross: true, zOrder: 1 },
            GO: { num: 4, img: imgPath+"GO.png", side: 60, isWithdrawable: true, isCross: true, isStar: true, zOrder: 1 },
            GB: { num: 5, img: imgPath+"GB.png", side: 60, isWithdrawable: true, isCross: true, isSquare: true,
isTriangle: true, zOrder: 1 },
            OG: { num: 6, img: imgPath+"OG.png", side: 60, isWithdrawable: true, isStar: true, isCross: true, zOrder: 1 },
            OO: { num: 7, img: imgPath+"OO.png", side: 60, isWithdrawable: true, isStar: true, zOrder: 1 },
            OB: { num: 8, img: imgPath+"OB.png", side: 60, isWithdrawable: true, isStar: true, isSquare: true,
isTriangle: true, zOrder: 1 },
            BG: { num: 9, img: imgPath+"BG.png", side: 60, isWithdrawable: true, isSquare: true,
isTriangle: true, isCross: true, zOrder: 1 },
            BO: { num: 10, img: imgPath+"BO.png", side: 60, isWithdrawable: true, isSquare: true,
isTriangle: true, isStar: true, zOrder: 1 },
            BB: { num: 11, img: imgPath+"BB.png", side: 60, isWithdrawable: true, isSquare: true,
isTriangle: true, zOrder: 1 },
            board_background: { num: 90, color: "#d3d3d3", side: 60, zOrder: 0 },
            board: { num: 91, side: 60, isWritable: true, zOrder: 1, isNumber: true, isBoard: true },
            board_notwritable: { num: 92, side: 60, zOrder: 1, isNumber: true },
            obstacle: { num: 14, img: imgPath+"brick_wall.png", side: 60, isObstacle: true, zOrder: 0 }
         }
      },
      biscuits: {
         newBlocks: [
            {
               name: "onChocolate",
               strings: {
                  fr: {
                     label: "sur chocolat",
                     code: "surChocolat",
                     description: "surChocolat(): Le robot est-il sur un biscuit au chocolat ?"
                  },
                  en: {
                     label: "on chocolate",
                     code: "onChocolate",
                     description: "onChocolate(): Is the robot on a chocolate biscuit?"
                  },
                  nl: {
                     label: "op chocolade",
                     code: "opChocolade",
                     description: "opChocolade(): Staat de robot op een chocoladekoekje?"
                  },
                  de: {
                     label: "auf Schokolade",
                     code: "aufSchokolade",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onChocolate",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isChocolate===true;}));
               }
            },
            {
               name: "onHole",
               strings: {
                  fr: {
                     label: "sur trou",
                     code: "surTrou",
                     description: "surTrou(): Le robot est-il sur un biscuit troué ?"
                  },
                  en: {
                     label: "on a hole",
                     code: "onHole",
                     description: "onHole(): Is the robot on a biscuit with a hole?"
                  },
                  nl: {
                     label: "op een gat",
                     code: "opGat",
                     description: "opGat(): Staat de robot op een koekje met een gat?"
                  },
                  de: {
                     label: "auf einem Loch",
                     code: "aufLoch",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onHole",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isHole===true;}));
               }
            },
            {
               name: "onCircle",
               strings: {
                  fr: {
                     label: "sur rond",
                     code: "surRond",
                     description: "surRond(): Le robot est-il sur un biscuit rond ?"
                  },
                  en: {
                     label: "on a circle",
                     code: "onCircle",
                     description: "onCircle(): Is the robot on a round biscuit?"
                  },
                  nl: {
                     label: "op een rondje",
                     code: "opRondje",
                     description: "opRondje(): Staat de robot op een rond koekje?"
                  },
                  de: {
                     label: "auf einem Kreis",
                     code: "aufKreis",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onCircle",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isCircle===true;}));
               }
            },
            {
               name: "onTriangle",
               strings: {
                  fr: {
                     label: "sur triangle",
                     code: "surTriangle",
                     description: "surTriangle(): Le robot est-il sur un biscuit triangle ?"
                  },
                  en: {
                     label: "on a triangle",
                     code: "onTriangle",
                     description: "onTriangle(): Is the robot on a triangle biscuit?"
                  },
                  nl: {
                     label: "op een driehoek",
                     code: "opDriehoek",
                     description: "opDriehoek(): Staat de robot op een driehoekig koekje?"
                  },
                  de: {
                     label: "auf einem Dreieck",
                     code: "aufDreieck",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onTriangle",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isTriangle===true;}));
               }
            },
            {
               name: "onSquare",
               strings: {
                  fr: {
                     label: "sur carré",
                     code: "surCarre",
                     description: "surCarre(): Le robot est-il sur un biscuit carré ?"
                  },
                  en: {
                     label: "on a square",
                     code: "onSquare",
                     description: "onSquare(): Is the robot on a square biscuit?"
                  },
                  nl: {
                     label: "op een vierkant",
                     code: "opVierkant",
                     description: "opVierkant(): Staat de robot op een vierkantig koekje?"
                  },
                  de: {
                     label: "auf einem Quadrat",
                     code: "aufQuadrat",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onSquare",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isSquare===true;}));
               }
            }
         ],
         noBorders: true,
         backgroundColor: "#F9E6C3",
         itemTypes: {
            red_robot: { img: imgPath+"red_robot.png", side: 90, nbStates: 1, isRobot: true,  offsetX: -15, offsetY: 15, zOrder: 2 },
            CCF: { num: 3, img: imgPath+"biscuit_circle_choc.png", side: 60, isWithdrawable: true, isCircle: true, isChocolate: true, Order: 1 },
            CCH: { num: 4, img: imgPath+"biscuit_circle_choc_hole.png", side: 60, isWithdrawable: true, isCircle: true, isChocolate: true, isHole: true, zOrder: 1 },
            CPF: { num: 5, img: imgPath+"biscuit_circle.png", side: 60, isWithdrawable: true, isCircle: true, zOrder: 1 },
            CPH: { num: 6, img: imgPath+"biscuit_circle_hole.png", side: 60, isWithdrawable: true, isCircle: true, isHole: true, zOrder: 1 },
            SCF: { num: 7, img: imgPath+"biscuit_square_choc.png", side: 60, isWithdrawable: true, isSquare: true, isChocolate: true, zOrder: 1 },
            SCH: { num: 8, img: imgPath+"biscuit_square_choc_hole.png", side: 60, isWithdrawable: true, isSquare: true, isChocolate: true, isHole: true, zOrder: 1 },
            SPF: { num: 9, img: imgPath+"biscuit_square.png", side: 60, isWithdrawable: true, isSquare: true, zOrder: 1 },
            SPH: { num: 10, img: imgPath+"biscuit_square_hole.png", side: 60, isWithdrawable: true, isSquare: true, isHole: true, zOrder: 1 },
            TCF: { num: 11, img: imgPath+"biscuit_triangle_choc.png", side: 60, isWithdrawable: true, isTriangle: true, isChocolate: true, zOrder: 1 },
            TCH: { num: 12, img: imgPath+"biscuit_triangle_choc_hole.png", side: 60, isWithdrawable: true, isTriangle: true, isChocolate: true, isHole: true, zOrder: 1 },
            TPF: { num: 13, img: imgPath+"biscuit_triangle.png", side: 60, isWithdrawable: true, isTriangle: true, zOrder: 1 },
            TPH: { num: 14, img: imgPath+"biscuit_triangle_hole.png", side: 60, isWithdrawable: true, isTriangle: true, isHole: true, zOrder: 1 },
            board_background: { num: 15, color: "#ffffff", side: 60, zOrder: 0 },
            board: {num: 16, side: 60, isWritable: true, zOrder: 1 },
            obstacle: { num: 17, img: imgPath+"obstacle.png", side: 60, isObstacle: true, zOrder: 0 }
         },
         checkEndCondition: robotEndConditions.checkSpecificCollection
      },
      poker: {
         newBlocks: [
            {
               name: "onHearts",
               strings: {
                  fr: {
                     label: "sur du coeur",
                     code: "surCoeur",
                     description: "surCoeur(): Le robot est-il sur une carte coeur ?"
                  },
                  en: {
                     label: "on hearts",
                     code: "onHearts",
                     description: "onHearts(): Is the robot on a hearts card?"
                  },
                  nl: {
                     label: "op harten",
                     code: "opHarten",
                     description: "opHarten(): Staat de robot op een hartenkaart?"
                  },
                  de: {
                     label: "auf Herz",
                     code: "aufHerz",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onHearts",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isHearts===true;}));
               }
            },
            {
               name: "onSpades",
               strings: {
                  fr: {
                     label: "sur du pique",
                     code: "surPique",
                     description: "surPique(): Le robot est-il sur un carte pique ?"
                  },
                  en: {
                     label: "on spades",
                     code: "onSpades",
                     description: "onSpades(): Is the robot on a spades card?"
                  },
                  nl: {
                     label: "op schoppen",
                     code: "opSchoppen",
                     description: "opSchoppen(): Staat de robot op een schoppenkaart?"
                  },
                  de: {
                     label: "auf Pik",
                     code: "aufPik",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onSpades",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isSpades===true;}));
               }
            },
            {
               name: "onClubs",
               strings: {
                  fr: {
                     label: "sur du trèfle",
                     code: "surTrefle",
                     description: "surTrefle(): Le robot est-il sur une carte trèfle ?"
                  },
                  en: {
                     label: "on clubs",
                     code: "onClubs",
                     description: "onClubs(): Is the robot on a clubs card?"
                  },
                  nl: {
                     label: "op klaveren",
                     code: "opKlaveren",
                     description: "opKlaveren(): Staat de robot op een klaverenkaart?"
                  },
                  de: {
                     label: "auf Kreuz",
                     code: "aufKreuz",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onClubs",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isClubs===true;}));
               }
            },
            {
               name: "onDiamonds",
               strings: {
                  fr: {
                     label: "sur du carreau",
                     code: "surCarreau",
                     description: "surCarreau(): Le robot est-il sur une case carreau ?"
                  },
                  en: {
                     label: "on diamonds",
                     code: "onDiamonds",
                     description: "onDiamonds(): Is the robot on a diamonds card?"
                  },
                  nl: {
                     label: "op ruiten",
                     code: "opRuiten",
                     description: "opRuiten(): Staat de robot op een ruitenkaart?"
                  },
                  de: {
                     label: "auf Karo",
                     code: "aufKaro",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onDiamonds",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isDiamonds===true;}));
               }
            },
            {
               name: "onOneShape",
               strings: {
                  fr: {
                     label: "sur une seule forme",
                     code: "surUneForme",
                     description: "surUneForme(): Le robot est-il sur une carte contenant une seule forme ?"
                  },
                  en: {
                     label: "on a single shape",
                     code: "onOneShape",
                     description: "onOneShape(): Is the robot on a card containing a single shape?"
                  },
                  nl: {
                     label: "op één vorm",
                     code: "opEenVorm",
                     description: "opEenVorm(): Staat de robot op een kaart met één vorm?"
                  },
                  de: {
                     label: "auf einer einzelnen Form",
                     code: "aufEinerForm",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onOneShape",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isOneShape===true;}));
               }
            },
            {
               name: "onTwoShapes",
               strings: {
                  fr: {
                     label: "sur deux formes",
                     code: "surDeuxFormes",
                     description: "surDeuxFormes(): Le robot est-il sur une carte contenant deux formes ?"
                  },
                  en: {
                     label: "on two shapes",
                     code: "onTwoShapes",
                     description: "onTwoShapes(): Is the robot on a card containing two shapes?"
                  },
                  nl: {
                     label: "op twee vormen",
                     code: "opTweeVormen",
                     description: "opTweeVormen(): Staat de robot op een kaart met twee vormen?"
                  },
                  de: {
                     label: "auf zwei Formen",
                     code: "aufZweiFormen",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onTwoShapes",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isTwoShapes===true;}));
               }
            }
         ],
         noBorders: true,
         backgroundColor: "#880015",
         itemTypes: {
            red_robot: { img: imgPath+"red_robot.png", side: 90, nbStates: 1, isRobot: true,  offsetX: -15, offsetY: 15, zOrder: 2 },
            H1: { num: 3, img: imgPath+"hearts_1.png", side: 60, isWithdrawable: true, isHearts: true, isOneShape: true, Order: 1 },
            H2: { num: 4, img: imgPath+"hearts_2.png", side: 60, isWithdrawable: true, isHearts: true, isTwoShapes: true, Order: 1 },
            S1: { num: 5, img: imgPath+"spades_1.png", side: 60, isWithdrawable: true, isSpades: true, isOneShape: true, Order: 1 },
            S2: { num: 6, img: imgPath+"spades_2.png", side: 60, isWithdrawable: true, isSpades: true, isTwoShapes: true, Order: 1 },
            C1: { num: 7, img: imgPath+"clubs_1.png", side: 60, isWithdrawable: true, isClubs: true, isOneShape: true, Order: 1 },
            C2: { num: 8, img: imgPath+"clubs_2.png", side: 60, isWithdrawable: true, isClubs: true, isTwoShapes: true, Order: 1 },
            D1: { num: 9, img: imgPath+"diamonds_1.png", side: 60, isWithdrawable: true, isDiamonds: true, isOneShape: true, Order: 1 },
            D2: { num: 10, img: imgPath+"diamonds_2.png", side: 60, isWithdrawable: true, isDiamonds: true, isTwoShapes: true, Order: 1 },
            board_background: { num: 15, color: "#ffffff", side: 60, zOrder: 0 },
            board: {num: 16, side: 60, isWritable: true, zOrder: 1 },
            obstacle: { num: 17, img: imgPath+"obstacle.png", side: 60, isObstacle: true, zOrder: 0 }
         },
         checkEndCondition: robotEndConditions.checkSpecificCollection
      },
      pearls: {
         newBlocks: [
            {
               name: "onBlue",
               strings: {
                  fr: {
                     label: "sur du bleu",
                     code: "surBleu",
                     description: "surBleu(): Le robot est-il sur un objet bleu ?"
                  },
                  en: {
                     label: "on blue",
                     code: "onBlue",
                     description: "onBlue(): Is the robot on a blue object?"
                  },
                  nl: {
                     label: "op blauw",
                     code: "opBlauw",
                     description: "opBlauw(): Staat de robot op een blauw voorwerp?"
                  },
                  de: {
                     label: "auf Blau",
                     code: "aufBlau",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onBlue",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isBlue===true;}));
               }
            },
            {
               name: "onHole",
               strings: {
                  fr: {
                     label: "sur trou",
                     code: "surTrou",
                     description: "surTrou(): Le robot est-il sur un objet troué ?"
                  },
                  en: {
                     label: "on a hole",
                     code: "onHole",
                     description: "onHole(): Is the robot on an object with a hole?"
                  },
                  nl: {
                     label: "op een gat",
                     code: "opGat",
                     description: "opGat(): Staat de robot op een voorwerp met een gat?"
                  },
                  de: {
                     label: "auf einem Loch",
                     code: "aufLoch",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onHole",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isHole===true;}));
               }
            },
            {
               name: "onYellow",
               strings: {
                  fr: {
                     label: "sur du jaune",
                     code: "surJaune",
                     description: "surJaune(): Le robot est-il sur un objet jaune ?"
                  },
                  en: {
                     label: "on yellow",
                     code: "onYellow",
                     description: "onYellow(): Is the robot on a yellow object?"
                  },
                  nl: {
                     label: "op geel",
                     code: "opGeel",
                     description: "opGeel(): Staat de robot op een geel voorwerp?"
                  },
                  de: {
                     label: "auf Gelb",
                     code: "aufGelb",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onYellow",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isYellow===true;}));
               }
            },
            {
               name: "onBlack",
               strings: {
                  fr: {
                     label: "sur du noir",
                     code: "surNoir",
                     description: "surNoir(): Le robot est-il sur un objet noir ?"
                  },
                  en: {
                     label: "on black",
                     code: "onBlack",
                     description: "onBlack(): Is the robot on a black object?"
                  },
                  nl: {
                     label: "op zwart",
                     code: "opZwart",
                     description: "opZwart(): Staat de robot op een zwart voorwerp?"
                  },
                  de: {
                     label: "auf Schwarz",
                     code: "aufSchwarz",
                  }
},
               category: "robot",
               type: "sensors",
               block: {
                  name: "onBlack",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isBlack===true;}));
               }
            }
         ],
         noBorders: true,
         backgroundColor: "#E9E9E9",
         itemTypes: {
            red_robot: { img: imgPath+"red_robot.png", side: 90, nbStates: 1, isRobot: true,  offsetX: -15, offsetY: 15, zOrder: 2 },
            PB: { num: 3, img: imgPath+"pearl_blue.png", side: 60, isWithdrawable: true, isBlue: true, isHole: true, Order: 1 },
            PY: { num: 4, img: imgPath+"pearl_yellow.png", side: 60, isWithdrawable: true, isYellow: true, isHole: true, zOrder: 1 },
            PBK: { num: 5, img: imgPath+"pearl_black.png", side: 60, isWithdrawable: true, isBlack: true, isHole: true, zOrder: 1 },
            BB: { num: 6, img: imgPath+"marble_blue.png", side: 60, isWithdrawable: true, isBlue: true, zOrder: 1 },
            BY: { num: 7, img: imgPath+"marble_yellow.png", side: 60, isWithdrawable: true, isYellow: true, zOrder: 1 },
            BBK: { num: 8, img: imgPath+"marble_black.png", side: 60, isWithdrawable: true, isBlack: true, zOrder: 1 },
            board_background: { num: 15, color: "#ffffff", side: 60, zOrder: 0 },
            board: {num: 16, side: 60, isWritable: true, zOrder: 1 },
            obstacle: { num: 17, img: imgPath+"obstacle.png", side: 60, isObstacle: true, zOrder: 0 }
         },
         checkEndCondition: robotEndConditions.checkSpecificCollection
      },
      bridges: {
         newBlocks: [
            {
               name: "dropBridgeInFront",
               strings: {
                  fr: {
                     label: "construire un pont devant",
                     code: "construirePontDevant",
                     description: "construirePontDevant(): construit un pont sur la case devant le robot"
                  },
                  en: {
                     label: "build a bridge ahead",
                     code: "buildBridgeAhead",
                     description: "buildBridgeAhead(): builds a bridge on the cell in front of the robot"
                  },
                  nl: {
                     label: "een brug vooraan bouwen",
                     code: "bouwBrugVoor",
                     description: "bouwBrugVoor(): bouwt een brug op het vakje voor de robot"
                  },
                  de: {
                     label: "eine Brücke davor bauen",
                     code: "brueckeDavorBauen",
                  }
},
               category: "robot",
               type: "actions",
               block: {
                  name: "dropBridgeInFront"
               },
               func: function(callback) {
                  var coords = context.coordsInFront();
                  if(this.getItemsOn(coords.row, coords.col, function(item) { return item.isOccupied === true; }).length != 0) {
                     this.leave(window.languageStrings.messages.failureDropPlatform);
                  }
                  this.destroyMask(coords.row, coords.col);
                  this.dropObject({type: "bridge"}, coords);
                  var obstacles = context.getItemsOn(coords.row, coords.col, function(obj) { return obj.isObstacle === true; });
                  for(var iObstacle = 0;iObstacle < obstacles.length;iObstacle++) {
                     obstacles[iObstacle].isObstacle = false;
                  }
                  this.callCallback(callback);
               }
            },
            {
               name: "waterInFront",
               strings: {
                  fr: {
                     label: "eau devant",
                     code: "eauDevant",
                     description: "eauDevant(): indique s'il y a de l'eau devant le robot"
                  },
                  en: {
                     label: "water ahead",
                     code: "waterAhead",
                     description: "waterAhead(): indicates whether there is water in front of the robot"
                  },
                  nl: {
                     label: "water voor",
                     code: "waterVoor",
                     description: "waterVoor(): geeft aan of er water voor de robot is"
                  },
                  de: {
                     label: "Wasser davor",
                     code: "wasserDavor",
                  }
},
               category: "robot",
               type: "sensors",
               block: { name: "waterInFront", yieldsValue: 'bool' },
               func: function(callback) {
                  var coords = context.coordsInFront();
                  this.callCallback(callback, this.hasOn(coords.row, coords.col, function(item) { return ((item.isObstacle === true) && (item.isOccupied === false)); }));
               }
            }
         ],

         backgroundColor: "#5cb1d6",
         borderColor: "#fff",
         itemTypes: {
            green_robot: { img: imgPath+"green_robot.png", side: 70, nbStates: 9, isRobot: true, offsetX: -5, offsetY: 5, zOrder: 3 },
            treasure: { num: 2, img: imgPath+"treasure.png", side: 70, isExit: true, isOccupied: true, offsetX: -5, zOrder: 0},
            water : { num: 1, side: 60, isObstacle: true, isOccupied: false, zOrder: 0 },
            island : { num: 3, img: imgPath+"island.png", side: 60, isOccupied: true, zOrder: 0 },
            bridge: { num: 4, img: imgPath+"bridge.png", side: 60, isOccupied: true, zOrder: 2 },
            wave : { num: 5, img: imgPath+"wave.png", side: 60, zOrder: 0},
            obstacle : { num: 6, img: imgPath+"obstacle.png", side: 60, isObstacle: true, isOccupied: true, zOrder: 0 },
            mask: {num: 7, img: imgPath+"mask.png", side: 60, isMask: true, zOrder: 2 },
         },
         checkEndCondition: robotEndConditions.checkReachExit

      },
      fishing: {
         backgroundColor: "#57b8bf",
         borderColor: "#489a9c",
         bagSize: 1,
         containerSize: 1,
         itemTypes: {
            robot: { img: imgPath+"buoy_robot.png", side: 60, nbStates: 1, isRobot: true, zOrder: 4, customDisplay: function(obj) {
            	if(context.bag.length != 0)
            		obj.img = imgPath+"buoy_robot_fishes.png";
            	else
            		obj.img = imgPath+"buoy_robot.png";
            } },
            island: { num: 2, img: imgPath+"island.png", side: 75, isContainer: true, offsetX: -7, offsetY: 0, zOrder: 0, containerFilter: function(obj) { return obj.isWithdrawable === true; } },
            fishes: { num: 3, img: imgPath+"fishes.png", side: 60, isWithdrawable: true, offsetY: 2, zOrder: 1 },
            fishes: { num: 4, img: imgPath+"fishes.png", side: 60, isWithdrawable: true, offsetY: 8, offsetX: 2, zOrder: 1, canBeOutside: true, customDisplay: function(obj) {
            	if(context.hasOn(obj.row, obj.col, function(item) { return item.num == 2; }))
            		obj.offsetX = 0;
            } },
            count_fishes: { num: 5, value: function(obj) {
               return context.getItemsOn(obj.row, obj.col, function(item) {
                  return item.isWithdrawable === true;
               }).length;
            }, side: 60, isWritable: true, fontColor: "#ffffff", fontBold: true, zOrder: 3, offsetX: -14, offsetY: -14},
            count_needs: { num: 6, value: function(obj) {
               return context.getItemsOn(obj.row, obj.col, function(item) {
                  return item.isContainer === true;
               })[0].containerSize;
            }, side: 60, isWritable: true, fontColor: "#ffffff", fontBold: true, zOrder: 3, offsetX: -15, offsetY: -14},
            obstacle: { num: 7, img: imgPath+"brick_wall.png", side: 60, isObstacle: true, zOrder: 0 },
            reef: { num: 9, img: imgPath+"reef.png", side: 60, isObstacle: true, zOrder: 0 },
            net: { num: 8, img: imgPath+"net.png", side: 60, zOrder: 2 },
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      flowers: {
         bagInit: {
           count: 200,
           type: "flower"
         },
         backgroundColor: "#BFF4A6",
         borderColor: "#A5D88B",
         itemTypes: {
            green_robot: { img: imgPath+"green_robot_above.png", side: 70, nbStates: 9, isRobot: true, offsetX: -5, offsetY: 5, zOrder: 2 },
            garden_robot: { img: imgPath+"garden_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            robot: { img: imgPath+"garden_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            //green_robot: { img: imgPath+"green_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            earth: { num: 2, img: imgPath+"earth.png", side: 60, isContainer: true, zOrder: 0 },
            flower: { num: 3, img: imgPath+"flower.png", side: 60, isWithdrawable: true, isObstacle: true, zOrder: 1 },
            fixed_flower: { num: 5, img: imgPath+"fixed_flower.png", side: 60, isObstacle: true, zOrder: 1 },
            number: { num: 6, side: 60, zOrder: 1 },
            bush: { num: 7, img: imgPath+"bush.png", side: 60, isObstacle: true, zOrder: 0 },
            water: { num: 8, img: imgPath+"water.png", side: 60, isObstacle: true, zOrder: 1 },
            tree: { num: 9, img: imgPath+"tree.png", side: 80, isObstacle: true, zOrder: 2, offsetX: -15, offsetY: 8 },
            bridge: { num: 10, img: imgPath+"water+board.png", side: 60, zOrder: 1 }
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      
      gems: {
         newBlocks: [
            {
               name: "writeCode",
               strings: {
                  fr: {
                     label: "écrire le code",
                     code: "ecrireCode",
                     description: "ecrireCode(): écrit le code sur la case du robot et ouvre la porte si le code est correct"
                  },
                  en: {
                     label: "write the code",
                     code: "writeCode",
                     description: "writeCode(): writes the code on the robot's cell and opens the door if the code is correct"
                  },
                  nl: {
                     label: "de code schrijven",
                     code: "schrijfCode",
                     description: "schrijfCode(): schrijft de code op het vakje van de robot en opent de deur als de code juist is"
                  },
                  de: {
                     label: "den Code schreiben",
                     code: "codeSchreiben",
                  }
},
               category: "robot",
               type: "actions",
               block: {
                  name: "writeCode",
                  params: [null]
               },
               func: function(value, callback) {
                  var robot = this.getRobot();
                  var answer = this.getItemsOn(robot.row, robot.col, function(obj) { return obj.answer !== undefined; })[0].answer;
                  var row_door = this.getItemsOn(robot.row, robot.col, function(obj) { return obj.answer !== undefined; })[0].row_door;
                  var col_door = this.getItemsOn(robot.row, robot.col, function(obj) { return obj.answer !== undefined; })[0].col_door;
                  if (answer == value) {
                     var doors = this.getItemsOn(row_door, col_door, function(obj) { return obj.isDoor === true; });
                     for (var iDoor = 0;iDoor < doors.length;iDoor++) {
                        this.destroy(doors[iDoor]);
                     }
                  }
                  this.writeNumber(robot.row, robot.col, value);
                  this.waitDelay(callback);
               }
            }
         ],
         backgroundColor: "#BF5E47",
         borderColor: "#96413B",
         itemTypes: {
            yellow_robot: { img: imgPath+"yellow_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            robot: { img: imgPath+"yellow_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            gem: { num: 3, img: imgPath+"gem.png", side: 60, isWithdrawable: true, autoWithdraw: true, zOrder: 1 },
            obstacle: { num: 4, img: imgPath+"brick_wall.png", side: 60, isObstacle: true, zOrder: 0 },
            number: { num: 5, side: 60, zOrder: 1 },
            door: { num: 6, img: imgPath+"door.png", side: 60, isObstacle: true, isDoor:true, zOrder: 0 },
            mask: {num:7, img: imgPath+"mask.png", isMask: true, side: 60, zOrder: 2},
            board_background: { num: 8, img: imgPath+"board.png", side: 60, zOrder: 0 },
            code_background: { num: 9, img: imgPath+"code.png", side: 60, zOrder: 0 },
            board: { side: 60, isWritable: true, zOrder: 1 }
         },
         checkEndCondition: robotEndConditions.checkPickedAllWithdrawables
      },
      help: {
         newBlocks: [
            {
               name: "onGreen",
               strings: {
                  fr: {
                     label: "sur la case verte",
                     code: "surCaseVerte",
                     description: "surCaseVerte(): Le robot est-il sur la case verte ?"
                  },
                  en: {
                     label: "on the green cell",
                     code: "onGreenCell",
                     description: "onGreenCell(): Is the robot on the green cell?"
                  },
                  nl: {
                     label: "op het groene vakje",
                     code: "opGroenVakje",
                     description: "opGroenVakje(): Staat de robot op het groene vakje?"
                  },
                  es: {
                     label: "sobre la casilla verde",
                     code: "sobreCasillaVerde",
                     description: "sobreCasillaVerde(): ¿Se encuentra el robot sobre la casilla verde?"
                  },
                  de: {
                     label: "auf dem grünen Feld",
                     code: "aufGrünemFeld",
                     // description: "aufGrünemFeld(): Steht der Roboter auf dem grünen Feld?"
                   }
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onGreen",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isGreen===true;}));
               }
            },
         ],
         itemTypes: {
            green_robot: { img: "green_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            obstacle: { num: 2, img: "obstacle.png", side: 60, isObstacle: true },
            green: { num: 3, color: "#b5e61d", side: 60, isGreen: true, isExit: true},
            number: { num: 4, side: 60, zOrder: 1 },
            board: {num: 5, side: 60, isWritable: true, zOrder: 1 },
            object: {num: 6, img: "object.png", side : 40, isWithdrawable: true, autoWithdraw: true, offsetX: 10, offsetY: -10, zOrder: 1}
         },
         checkEndCondition: robotEndConditions.checkReachExit
      },
      laser: {
         backgroundColor: "#666699",
         borderColor: "#40405e",
         itemTypes: {
            robot: { img: imgPath+"white_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2, isOpaque: true },
            obstacle: { num: 2, img: imgPath+"asteroide.png", side: 60, isObstacle: true, isOpaque: true },
            light: { num: 3, img: imgPath+"off_spot.png", states: [imgPath+"off_spot.png", imgPath+"on_spot.png"], isLight: true, state: 0, side: 60 },
            launcher: { num: 5, img: imgPath+"launcher2.png", isLaser: true, side: 60 },
            mirrorN: { num: 6, img: imgPath+"mirrorN.png", isMirror: true, mirrorFunction: function(dir) { return (14 - dir) % 8; }, side: 60 },
            mirrorZ: { num: 7, img: imgPath+"mirrorZ.png", isMirror: true, mirrorFunction: function(dir) { return (10 - dir) % 8; }, side: 60 },
            mirrorH: { num: 8, img: imgPath+"mirrorH.png", isMirror: true, mirrorFunction: function(dir) { return (12 - dir) % 8; }, side: 60 },
            mirrorI: { num: 9, img: imgPath+"mirrorI.png", isMirror: true, mirrorFunction: function(dir) { return (8 - dir) % 8; }, side: 60 },
            number: { side: 60, zOrder: 1 },
            board_background: { num: 90, color: "#d3d3d3", side: 60, zOrder: 0 },
            board: { num: 91, side: 60, isWritable: true, zOrder: 1, isNumber: true, isBoard: true },
            board_notwritable: { num: 92, side: 60, zOrder: 1, isNumber: true },
         },
         checkEndCondition: robotEndConditions.checkLights
      }, 
      marbles: {
         // newBlocks: [
         //    {
         //      name: "onOrange",
         //      strings: {
         //        de: {
         //           label: "orange",
         //           code: "aufOrange",
         //           description: "aufOrange(): Steht der Roboter auf einem orangenen Feld?"
         //         }
         //      },
         //      category: "robot",
         //      type: "sensors",
         //      block: {
         //        name: "onOrange",
         //        yieldsValue: true
         //      },
         //      func: function(callback) {
         //        this.callCallback(callback, this.isOn(function(obj) {return obj.isOrange===true;}));
         //      }
         //    },
         //    {
         //      name: "onBlue",
         //      strings: {
         //        de: {
         //           label: "blau",
         //           code: "aufBlau",
         //           description: "aufBlau(): Steht der Roboter auf einem blauen Feld?"
         //         }
         //      },
         //      category: "robot",
         //      type: "sensors",
         //      block: {
         //        name: "onBlue",
         //        yieldsValue: true
         //      },
         //      func: function(callback) {
         //        this.callCallback(callback, this.isOn(function(obj) {return obj.isBlue===true;}));
         //      }
         //    }
         //  ],
         bagSize: 1,
         backgroundColor: "#dadada",
         itemTypes: {
            blue_robot: { img: imgPath+"blue_robot.png", side: 90, nbStates: 1, isRobot: true,  offsetX: -15, offsetY: 15, zOrder: 2 },
            red_robot: { img: imgPath+"red_robot_alt.png", side: 90, nbStates: 1, isRobot: true,  offsetX: -15, offsetY: 15, zOrder: 2 },
            robot: { img: imgPath+"red_robot.png", side: 90, nbStates: 1, isRobot: true,  offsetX: -15, offsetY: 15, zOrder: 2 },
            //blue_robot: { img: imgPath+"blue_robot.png", side: 90, nbStates: 1, isRobot: true,  offsetX: -15, offsetY: 15, zOrder: 2 },
            wall: { num: 2, img: imgPath+"wall.png", side: 60, isObstacle: true, zOrder: 0 },
            hole: { num: 3, img: imgPath+"hole.png", side: 60, isContainer: true, zOrder: 0 },
            marble: { num: 4, img: imgPath+"marble.png", side: 60, isWithdrawable: true, zOrder: 1 },
            number: { num: 5, side: 60, zOrder: 1 },
            board_background: { num: 90, color: "#d3d3d3", side: 60, zOrder: 0 },
            board: { num: 91, side: 60, isWritable: true, zOrder: 1, isNumber: true, isBoard: true },
            board_notwritable: { num: 92, side: 60, zOrder: 1, isNumber: true },
            white: { num: 7, color: imgPath+"shadow.png", side: 60, zOrder: 0 }
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      objects_in_space: {
         backgroundColor: "#666699",
         itemTypes: {
            robot: { img: imgPath+"white_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            stars: { num: 3, img: imgPath+"stars.png", side: 60, zOrder: 0},
            objet1: { num: 4, img: imgPath+"objet1.png", side: 60, isWithdrawable: true, zOrder: 1 },
            objet2: { num: 5, img: imgPath+"objet2.png", side: 60, isWithdrawable: true, zOrder: 1 },
            objet3: { num: 7, img: imgPath+"solar_panel.png", side: 60, isWithdrawable: true, zOrder: 1 },
            obstacle: { num: 6, img: imgPath+"asteroide.png", side: 60, isObstacle: true, zOrder: 0 }
         },
         checkEndCondition: robotEndConditions.checkPickedAllWithdrawables
      },
      packages: {
         bagSize: 1,
         containerSize: 1,
         hasGravity: true,
         backgroundColor: "#a0cc97",
         borderColor: "#81a279",
         itemTypes: {
            robot: { img: imgPath+"green_robot.png", side: 90, nbStates: 9, isRobot: true,  offsetX: -11, zOrder: 4, customDisplay: function(obj) {
            	if(context.bag.length != 0)
            		obj.img = imgPath+"green_robot_book.png";
            	else
            		obj.img = imgPath+"green_robot.png";
            } },
            box: { num: 2, img: imgPath+"cardboard_box.png", side: 60, isContainer: true, zOrder: 2, containerFilter: function(obj) { return obj.isWithdrawable === true; } },
            books: { num: 3, img: imgPath+"books.png", side: 60, isWithdrawable: true, offsetY: 12, zOrder: 1 },
            books_outside: { num: 4, img: imgPath+"books.png", side: 60, isWithdrawable: true, offsetY: 12, zOrder: 1, canBeOutside: true, customDisplay: function(obj) {
            	if(context.hasOn(obj.row, obj.col, function(item) { return item.num == 2; }))
            		obj.offsetY = -5;
            } },         
            count_books: { num: 5, value: function(obj) {
               return context.getItemsOn(obj.row, obj.col, function(item) {
                  return item.isWithdrawable === true;
               }).length;
            }, side: 60, isWritable: true, fontColor: "#752a43", fontBold: true, zOrder: 2, offsetX: -20, offsetY: -12},
            count_needs: { num: 6, value: function(obj) {
               return context.getItemsOn(obj.row, obj.col, function(item) {
                  return item.isContainer === true;
               })[0].containerSize;
            }, side: 60, isWritable: true, fontColor: "#666666", fontBold: true, zOrder: 3, offsetX: 0, offsetY: 13},
            platform: { num: 7, img: imgPath+"shelf.png", side: 60, isObstacle: true, zOrder: 0 },
            square_platform: { num: 8, img: imgPath+"square_shelf.png", side: 60, isObstacle: true, zOrder: 0 }
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      paint: {
         newBlocks: [
            {
               name: "onPaint",
               strings: {
                  fr: {
                     label: "peinture sur la case",
                     code: "surPeinture",
                     description: "surPeinture(): Le robot est-il sur une case déjà peinte ?"
                  },
                  en: {
                     label: "paint on the cell",
                     code: "onPaint",
                     description: "onPaint(): Is the robot on a cell that is already painted?"
                  },
                  nl: {
                     label: "verf op het vakje",
                     code: "opVerf",
                     description: "opVerf(): Staat de robot op een al geschilderd vakje?"
                  },
                  es: {
                     label: "casilla pintada",
                     code: "casillaPintada",
                     description: "casillaPintada(): ¿El robot se encuentra sobre una casilla pintada?"
                  },
                  de: {
                     label: "Farbe auf Feld",
                     code: "farbeAufFeld",
                     //description: "farbeAufFeld(): Steht der Roboter auf einem bemalten Feld?"
                  },
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onPaint",
                  yieldsValue: 'bool'
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) {return obj.isPaint === true || 
                     obj.isWithdrawable === true;}));
               }
            },
            {
               name: "paintNorth",
               strings: {
                  de: {
                     label: "Farbe oben",
                     code: "farbeOben",
                     // description: "farbeOben(): ist das Feld über dem Roboter bemalt?"
                  },
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "paintNorth",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.hasOn(this.getRobot().row - 1, this.getRobot().col, function(obj) { return (obj.isPaint === true || 
                     obj.isWithdrawable === true ); }));
               }
            },
            {
               name: "paintSouth",
               strings: {
                  de: {
                     label: "Farbe unten",
                     code: "farbeUnten",
                     // description: "farbeUnten(): ist das Feld unter dem Roboter bemalt?"
                  },
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "paintSouth",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.hasOn(this.getRobot().row + 1, this.getRobot().col, function(obj) { return (obj.isPaint === true || 
                     obj.isWithdrawable === true ); }));
               }
            },
            {
               name: "paintNorthEast",
               strings: {
                  de: {
                     label: "Farbe rechts oben",
                     code: "farbeObenRechts",
                     // description: "farbeObenRechts(): ist das Feld rechts über dem Roboter bemalt?"
                  },
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "paintNorthEast",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.hasOn(this.getRobot().row - 1, this.getRobot().col + 1, function(obj) { return (obj.isPaint === true || 
                     obj.isWithdrawable === true ); }));
               }
            },
            {
               name: "paintNorthWest",
               strings: {
                  de: {
                     label: "Farbe links oben",
                     code: "farbeObenLinks",
                     // description: "farbeObenLinks(): ist das Feld links über dem Roboter bemalt?"
                  },
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "paintNorthWest",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.hasOn(this.getRobot().row - 1, 
                                             this.getRobot().col - 1, 
                                             function(obj) { return (obj.isPaint === true || 
                                                                     obj.isWithdrawable === true ); }
                                                         )
                                    );
               }
            },

         ],
         bagInit: {
           count: 200,
           type: "paint"
         },
         ignoreBag: true,
         backgroundColor: "#c5e2dd",
         borderColor: "#b4ccc7",
         itemTypes: {
            robot: { img: imgPath+"blue_robot.png", side: 90, nbStates: 1, isRobot: true, offsetX: -15, offsetY: 15, zOrder: 3 },
            initialPaint: { num: 3, color: "#146c6e", side: 60, isPaint: true, isColor: true, zOrder: 1 },
            marker: { num: 2, img: imgPath+"paint_marker.png", side: 60, isContainer: true, containerFilter: function(item) {return item.type === "paint";}, zOrder: 0 },
            marker_white: { num: 4, img: imgPath+"dot_white.png", isContainer: true, isFake: true, side: 60, zOrder: 0 },
            paint: { img: imgPath+"paint.png", side: 60, isWithdrawable: true, isColor: true, zOrder: 1 },
            // paint: { color: "#2e1de5", side: 60, isWithdrawable: true, zOrder: 1 },
            number: { side: 60, zOrder: 2 },
            board_background: { num: 90, color: "#d3d3d3", side: 60, zOrder: 0 },
            board: { num: 91, side: 60, isWritable: true, zOrder: 1, isNumber: true, isBoard: true },
            board_notwritable: { num: 92, side: 60, zOrder: 2, isNumber: true },
            wall: { num: 5, img: imgPath+"grey_brick_wall.png", side: 60, isObstacle: true, zOrder: 0 },
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      pixelArt: {
         newBlocks: (function(names, colors, colorsSecondary, colorsTertiary, translations) {
            var blocks = [];
            for(var iColor = 0;iColor < colors.length;iColor++) {
               blocks.push({
                  name: names[iColor],
                  strings: {
                    fr: {
                       label: translations["fr"][iColor],
                       code: translations["fr"][iColor],
                       description: translations["fr"][iColor] + "(): Peint la case en " + translations["de"][iColor]
                    },
                    de: {
                     label: translations["de"][iColor],
                     code: translations["de"][iColor],
                     // description: translations["de"][iColor] + "(): Bemale das Feld in " + translations["de"][iColor]
                  }
                  },
                  category: "robot",
                  type: "actions",
                  block: {
                     name: names[iColor], blocklyJson: {"colour": colors[iColor], "colourSecondary": colorsSecondary[iColor], "colourTertiary": colorsTertiary[iColor]}
                  },
                  func: (function(cur_color) { return function(callback) {
                     var robot = this.getRobot();
                     if(infos.allowRewrite === true) {
                        this.withdraw(undefined, false);
                     }
                     else if(this.isOn(function(obj) { return obj.isWithdrawable === true;})) {
                        throw(window.languageStrings.messages.failureRewrite);
                     }
                     var coords = context.coordsInFront();
                     var ttbo = context.tryToBeOn(coords.row, coords.col);
                     this.dropObject({type: "paint", color: cur_color});
                     if(ttbo === true) {
                        this.forward(callback);
                     } else {
                        if (robot.col == context.nbCols - 1) {
                           robot.row = (robot.row + 1) //% context.nbRows;
                           if (robot.row == context.nbRows ) {
                              //context.moveRobot(robot.row + (coords.row - robot.row) / 4, robot.col + (coords.col - robot.col) / 4, robot.dir);
                              this.callCallback(callback)
                              //throw(window.languageStrings.messages.leavesGrid);
                           } else {
                              robot.col = 0;
                              redisplayItem(robot);
                              this.callCallback(callback);
                           }
                        }
                     } 
                  } })(colors[iColor])
               });
            }
            return blocks;
         })(["Gelb", "Orange", "Tangerine", "Weiß", "Rot", "Pink", "Violett", "Türkis", "Blau", "Blaugrün", "Schwarz"], 
            ["#ffd35c", "#ff8201", "#f37252", "#ffffff", "#c72c3a", "#ea3e70", "#954567", "#4bc4d5", "#0180b5", "#02b5a0", "#000000"], 
            ["#ffd35c", "#ff8201", "#f37252", "#ffffff", "#c72c3a", "#ea3e70", "#954567", "#4bc4d5", "#0180b5", "#02b5a0", "#000000"], 
            ["#ffd35c", "#ff8201", "#f37252", "#ffffff", "#c72c3a", "#ea3e70", "#954567", "#4bc4d5", "#0180b5", "#02b5a0", "#000000"],
            {fr: ["rouge", "bleu", "jaune", "blanc", "vert", "orange", "rose", "violet", "marron", "gris", "noir"],
             en: ["Yellow", "Orange", "Tangerine", "White", "Red", "Pink", "Violet", "Turquoise", "Blue", "Teal", "Black"],
             nl: ["Geel", "Oranje", "Mandarijn", "Wit", "Rood", "Roze", "Violet", "Turkoois", "Blauw", "Blauwgroen", "Zwart"],
             de: ["Gelb", "Orange", "Tangerine", "Weiß", "Rot", "Pink", "Violett", "Türkis", "Blau", "Blaugrün", "Schwarz"]}),
         backgroundColor: "#ece4ce",
         ignoreBag: true,
         blockingFilter: false,
         itemTypes: {
            robot: { img: imgPath+"cursor.png", side: 60, nbStates: 9, isRobot: true, zOrder: 2 },
            marker_Gelb: { num: 2, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#ffd35c";} },
            marker_Orange: { num: 3, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#ff8201";} },
            marker_Tangerine: { num: 4, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#f37252";} },
            marker_Weiss: { num: 5, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#ffffff";} },
            marker_Rot: { num: 6, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#c72c3a";} },
            marker_Pink: { num: 7, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#ea3e70";} },
            marker_Violett: { num: 8, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#954567";} },
            marker_Türkis: { num: 9, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#4bc4d5";} },
            marker_Blau: { num: 10, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#0180b5";} },
            marker_Blaugrün: { num: 11, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#02b5a0";} },
            marker_Schwarz: { num: 12, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.color === "#000000";} },
            paint: { side: 60, isWithdrawable: true, zOrder: 1 },
            marker_paint: { num: 1, side: 60, isContainer: true, zOrder: 0, containerFilter: function(item) {return item.type === "paint";} },
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      rocket: {
         newBlocks: [
            {
               name: "onExit",
               strings: {
                  de: {
                     label: "Rakete erreicht",
                     code: "raketeErreich",
                     // description: "raketeErreicht(): steht der Roboter auf dem Feld mit der Rakete?"
                  },
               },
               category: "robot",
               type: "sensors",
               block: {
                  name: "onExit",
                  yieldsValue: true
               },
               func: function(callback) {
                  this.callCallback(callback, this.isOn(function(obj) { return (obj.isExit === true); }));
               }
            }
         ],
         backgroundColor: "#666699",
         itemTypes: {
            robot: { img: imgPath+"white_robot.png", side: 74, nbStates: 9, isRobot: true, offsetX: -7,
offsetY: 7, zOrder: 2 },
            board_background: { num: 90, color: "#d3d3d3", side: 60, zOrder: 0 },
            board: { num: 91, side: 60, isWritable: true, zOrder: 1, isNumber: true, isBoard: true },
            board_notwritable: { num: 92, side: 60, zOrder: 1, isNumber: true },
            // stars: { num: 3, img: "stars.png", side: 60, zOrder: 1},
            asteroide: { num: 4, img: imgPath+"asteroide.png", side: 60, isObstacle: true, zOrder: 1 },
            rocket: { num: 5, img: imgPath+"rocket.png", side: 65, offsetX: -1, offsetY: 4, isExit: true, zOrder: 1 },
            // obstacle: { num: 6, img: "obstacle.png", side: 60, isObstacle: true, zOrder: 1 },
            objet1: { num: 7, img: imgPath+"solar_panel.png", side: 60, isWithdrawable: true, zOrder: 1 },
            // objet2: { num: 8, img: "objet2.png", side: 60, isWithdrawable: true, zOrder: 1 }, 
            number: { side: 60, zOrder: 1 }            
         },
         checkEndCondition: robotEndConditions.checkBothReachAndCollect
      },
      sokoban: {
         backgroundColor: "#c2c6f2",
         borderColor: "#a4aacd",
         itemTypes: {
            board_background: { num: 90, color: "#d3d3d3", side: 60, zOrder: 0 },
            board: { num: 91, side: 60, isWritable: true, zOrder: 1, isNumber: true, isBoard: true },
            board_notwritable: { num: 92, side: 60, zOrder: 1, isNumber: true },
            robot: { img: imgPath+"orange_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, zOrder: 2 },
            wall: { num: 2, img: imgPath+"grey_brick_wall.png", side: 60, isObstacle: true, zOrder: 0 },
            marker: { num: 3, img: imgPath+"marker.png", side: 60, isContainer: true, zOrder: 0 },
            box: { num: 4, img: imgPath+"box.png", side: 60, isObstacle: true, isPushable: true, isWithdrawable: true, zOrder: 1 },
            number: { num: 5, side: 60, zOrder: 1 }            
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      gears: {
         backgroundColor: "#f2f1e3",
         hasGravity: true,
         bagSize: 1,
         containerSize: 1,
         itemTypes: {
            robot: { img: imgPath+"castle_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, offsetY: 5, zOrder: 3 },
            platform: { num: 2, img: imgPath+"platform.png", side: 60, isObstacle: true, zOrder: 0 },
            gears: { num: 4, img: imgPath+"gears.png", side: 60, isContainer: true, zOrder: 1},
            wheel: { num:5, img: imgPath+"wheel.png", side: 60, isWithdrawable: true, zOrder: 2},
            // projectile: {num: 6, img: imgPath+"projectile.png", side: 60, zOrder: 4, action: function(item, time) { this.moveProjectile(item); }, isProjectile: true},
            // //door: { num: 8, img: imgPath+"door.png", side: 60, isExit: true, zOrder: 1},
            // dispersion: {img: imgPath+"dispersion.png", side: 60, zOrder: 4, action: function(item, time) { this.destroy(item); }, isProjectile: true},
            // dispersion_robot: {img: imgPath+"dispersion.png", side: 60, zOrder: 4, offsetY: -15, action: function(item, time) { this.destroy(item); }, isProjectile: true},
            // projectile_generator: {num: 7, side: 60, action: function(item, time) {
            //    if(item.period == undefined)
            //       item.period = 1;
            //    if(item.start == undefined)
            //       item.start = 1;
            //    if(time % item.period == item.start) 
            //       this.dropObject({type: "projectile"}, {row: item.row, col: item.col}); 
            // }}
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      veterinary: {
         bagSize: 1,
         containerSize: 1,
         backgroundColor: "#e8c999",
         borderColor: "#a67d40",
         itemTypes: {
            robot: { img: imgPath+"veterinary_robot.png", side: 90, nbStates: 9, isRobot: true,  offsetX: -11, zOrder: 2 },
            beaver: { num: 2, img: imgPath+"beaver.png", side: 70, isContainer: true, zOrder: 0, containerFilter: function(obj) { return obj.isWithdrawable === true; } },
            wood: { num: 3, img: imgPath+"wood.png", side: 60, isWithdrawable: true,  offsetY: 10, zOrder: 1 },
            wood_outside: { num: 5, img: imgPath+"wood.png", side: 60, isWithdrawable: true,  offsetY: 10, zOrder: 1, canBeOutside: true },
            tree: { num: 4, img: imgPath+"tree.png", side: 70, isObstacle: true, offsetY: 5, zOrder: 0 }, 
            count_wood: { num: 6, value: function(obj) {
               return context.getItemsOn(obj.row, obj.col, function(item) {
                  return item.isWithdrawable === true;
               }).length;
            }, side: 60, isWritable: true, fontColor: "#0B3D2E", fontBold: true, zOrder: 1, offsetX: 20, offsetY: 17},
            count_needs: { num: 7, value: function(obj) {
               return context.getItemsOn(obj.row, obj.col, function(item) {
                  return item.isContainer === true;
               })[0].containerSize;
            }, side: 60, isWritable: true, fontColor: "#4B0082", fontBold: true, zOrder: 1, offsetX: -20, offsetY: -17},
         },
         checkEndCondition: robotEndConditions.checkContainersFilled
      },
      wiring: {
        backgroundColor: "#00733f",
        borderColor: "#ffd35c",
        maxWireLength: 100,
        maxTotalLength: 100000,
        itemTypes: {
          robot: { img: imgPath+"red_robot.png", side:70, nbStates: 1, isRobot: true, offsetX: -5, offsetY: 5, zOrder: 3 },
          wire: { img: "wire.png", side: 60, isWire: true, zOrder: 1},
          black_male: { num: 2, img: "black_male.png", side: 60, zOrder: 0, plugType: 1},
          black_female: { num: 3, img: "black_female.png", side: 60, zOrder: 0, plugType: -1},
          white_male: { num: 4, img: "white_male.png", side: 60, zOrder: 0, plugType: 2},
          white_female: { num: 5, img: "white_female.png", side: 60, zOrder: 0, plugType: -2},
        },
        checkEndCondition: robotEndConditions.checkPlugsWired
      }
   };
   var iconSrc = $("img[src$='icon.png']").attr("src");
   var imgPrefix = iconSrc.substring(0, iconSrc.length - 8);
   function imgUrlWithPrefix(url) {
      return /^https?:\/\//.exec(url) ? url : imgPrefix + url;
   }

   function getImgPath(url) {
      if (window.modulesPath != undefined) {
         return window.modulesPath + "img/algorea/" + url;
      }
      return imgUrlWithPrefix(url)
   }
   
   if(infos.newBlocks == undefined)
      infos.newBlocks = [];
   if(infos.maxFallAltitude == undefined)
      infos.maxFallAltitude = 2;
   
   var loadContext = function(name) {
      for(var language in contextStrings[name]) {
         var ctx = contextStrings[name][language];
         for(var type in ctx) {
            if((typeof ctx[type]) === "string") {
               localLanguageStrings[language][type] = ctx[type];
            }
            else {
               if(localLanguageStrings[language][type] == undefined)
                  localLanguageStrings[language][type] = {};
               for(var line in ctx[type]) {
                  localLanguageStrings[language][type][line] = ctx[type][line];
               }
            }
         }
      }
      
      for(var param in contextParams[name]) {
         if(infos[param] === undefined || param == "newBlocks") {
            infos[param] = contextParams[name][param];
         }
         if (param === 'itemTypes') {
            for (var itemType in contextParams[name].itemTypes) {
               if (infos.itemTypes[itemType] === undefined) {
                  infos.itemTypes[itemType] = contextParams[name].itemTypes[itemType];
               }
            }
         }
      }
   };
   
   loadContext("none");
   if(infos.contextType != undefined) {
      loadContext(infos.contextType);
   }
   
   infos.newBlocks.push({
      name: "row",
      type: "sensors",
      block: { name: "row", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, 1 + this.getRobot().row);
      }
   });
   
   infos.newBlocks.push({
      name: "col",
      type: "sensors",
      block: { name: "col", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, 1 + this.getRobot().col);
      }
   });
   
   infos.newBlocks.push({
      name: "wait",
      type: "actions",
      block: { name: "wait" },
      func: function(callback) {
         this.advanceTime(1);
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "north",
      type: "actions",
      block: { name: "north" },
      func: function(callback) {
         this.north(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "south",
      type: "actions",
      block: { name: "south" },
      func: function(callback) {
         this.south(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "east",
      type: "actions",
      block: { name: "east" },
      func: function(callback) {
         this.east(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "west",
      type: "actions",
      block: { name: "west" },
      func: function(callback) {
         this.west(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "left",
      type: "actions",
      block: { name: "left" },
      func: function(callback) {
         this.turnLeft(callback);
      }
   });

   infos.newBlocks.push({
      name: "right",
      type: "actions",
      block: { name: "right" },
      func: function(callback) {
         this.turnRight(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "turnAround",
      type: "actions",
      block: { name: "turnAround" },
      func: function(callback) {
         this.turnAround(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "forward",
      type: "actions",
      block: { name: "forward" },
      func: function(callback) {
         this.forward(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "backwards",
      type: "actions",
      block: { name: "backwards" },
      func: function(callback) {
         this.backwards(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "jump",
      type: "actions",
      block: { name: "jump" },
      func: function(callback) {
         this.jump(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "obstacleInFront",
      type: "sensors",
      block: { name: "obstacleInFront", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.obstacleInFront());
      }
   });
   
   infos.newBlocks.push({
      name: "obstacleEast",
      type: "sensors",
      block: { name: "obstacleEast", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, this.hasOn(robot.row, robot.col + 1, function(obj) { return obj.isObstacle === true; }));
      }
   });
   
   infos.newBlocks.push({
      name: "obstacleWest",
      type: "sensors",
      block: { name: "obstacleWest", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, this.hasOn(robot.row, robot.col - 1, function(obj) { return obj.isObstacle === true; }));
      }
   });
   
   infos.newBlocks.push({
      name: "obstacleNorth",
      type: "sensors",
      block: { name: "obstacleNorth", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, this.hasOn(robot.row - 1, robot.col, function(obj) { return obj.isObstacle === true; }));
      }
   });
   
   infos.newBlocks.push({
      name: "obstacleSouth",
      type: "sensors",
      block: { name: "obstacleSouth", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, this.hasOn(robot.row + 1, robot.col, function(obj) { return obj.isObstacle === true; }));
      }
   });
   
   infos.newBlocks.push({
      name: "obstacleRight",
      type: "sensors",
      block: { name: "obstacleRight", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         var coords = this.coordsInFront(1);
         this.callCallback(callback, this.hasOn(coords.row, coords.col, function(obj) { return obj.isObstacle === true; }));
      }
   });
   
   infos.newBlocks.push({
      name: "obstacleLeft",
      type: "sensors",
      block: { name: "obstacleLeft", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         var coords = this.coordsInFront(3);
         this.callCallback(callback, this.hasOn(coords.row, coords.col, function(obj) { return obj.isObstacle === true; }));
      }
   });
   
   infos.newBlocks.push({
      name: "gridEdgeEast",
      type: "sensors",
      block: { name: "gridEdgeEast", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, !this.isInGrid(robot.row, robot.col + 1));
      }
   });
   
   infos.newBlocks.push({
      name: "gridEdgeWest",
      type: "sensors",
      block: { name: "gridEdgeWest", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, !this.isInGrid(robot.row, robot.col - 1));
      }
   });
   
   infos.newBlocks.push({
      name: "gridEdgeNorth",
      type: "sensors",
      block: { name: "gridEdgeNorth", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, !this.isInGrid(robot.row - 1, robot.col));
      }
   });
   
   infos.newBlocks.push({
      name: "gridEdgeSouth",
      type: "sensors",
      block: { name: "gridEdgeSouth", yieldsValue: 'bool' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, !this.isInGrid(robot.row + 1, robot.col));
      }
   });
      
   infos.newBlocks.push({
      name: "platformInFront",
      type: "sensors",
      block: { name: "platformInFront", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.platformInFront());
      }
   });
   
   infos.newBlocks.push({
      name: "platformAbove",
      type: "sensors",
      block: { name: "platformAbove", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.platformAbove());
      }
   });

   infos.newBlocks.push({
      name: "withdrawObject",
      type: "actions",
      block: { name: "withdrawObject" },
      func: function(callback) {
         this.withdraw();
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "dropObject",
      type: "actions",
      block: { name: "dropObject" },
      func: function(callback) {
         this.drop();
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "onObject",
      type: "sensors",
      block: { name: "onObject", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.isOn(function(obj) { return obj.isWithdrawable === true;}));
      }
   });
   
   infos.newBlocks.push({
      name: "onContainer",
      type: "sensors",
      block: { name: "onContainer", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.isOn(function(obj) { return obj.isContainer === true;}));
      }
   });
   
   infos.newBlocks.push({
      name: "onNumber",
      type: "sensors",
      block: { name: "onNumber", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.isOn(function(obj) { return obj.value !== undefined;}));
      }
   });
	
	infos.newBlocks.push({
      name: "onLauncher",
      type: "sensors",
      block: { name: "onLauncher", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.isOn(function(obj) { return obj.isLaser === true;}));
      }
   });
   
   infos.newBlocks.push({
      name: "onWritable",
      type: "sensors",
      block: { name: "onWritable", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.isOn(function(obj) { return obj.isWritable === true; }));
      }
   });
   
   infos.newBlocks.push({
      name: "writeNumber",
      type: "actions",
      block: { name: "writeNumber", params: [null] },
      func: function(value, callback) {
         var robot = this.getRobot();
         this.writeNumber(robot.row, robot.col, value);
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "readNumber",
      type: "sensors",
      block: { name: "readNumber", yieldsValue: 'int' },
      func: function(callback) {
         var robot = this.getRobot();
         this.destroyMask(robot.row, robot.col);
         this.callCallback(callback, this.readNumber(robot.row, robot.col));
      }
   });
   
   infos.newBlocks.push({
      name: "nbWithdrawables",
      type: "sensors",
      block: { name: "nbWithdrawables", yieldsValue: 'int' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, this.getItemsOn(robot.row, robot.col, function(obj) { return obj.isWithdrawable === true; }).length);
      }
   });
   
   infos.newBlocks.push({
      name: "nbInBag",
      type: "sensors",
      block: { name: "nbInBag", yieldsValue: 'int' },
      func: function(callback) {
         var robot = this.getRobot();
         this.callCallback(callback, context.bag.length);
      }
   });
   
   infos.newBlocks.push({
      name: "containerSize",
      type: "sensors",
      block: { name: "containerSize", yieldsValue: 'int' },
      func: function(callback) {
         var robot = this.getRobot();
         var containers = this.getItemsOn(robot.row, robot.col, function(obj) { return obj.isContainer === true; });
         
         if(containers.length == 0) {
            this.callCallback(callback, 0);
            return;
         }
         
         this.callCallback(callback, containers[0].containerSize);
      }
   });
   
   infos.newBlocks.push({
      name: "pushObject",
      type: "actions",
      block: { name: "pushObject" },
      func: function(callback) {
         this.pushObject(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "pushableInFront",
      type: "sensors",
      block: { name: "pushableInFront", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.isInFront(function(obj) { return obj.isPushable === true; }));
      }
   });
   
   infos.newBlocks.push({
      name: "dropInFront",
      type: "actions",
      block: { name: "dropInFront" },
      func: function(callback) {
         this.drop(1, this.coordsInFront());
         this.callCallback(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "dropAbove",
      type: "actions",
      block: { name: "dropAbove" },
      func: function(callback) {
         this.drop(1, {row: this.getRobot().row - 1, col: this.getRobot().col});
         this.callCallback(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "withdrawNum_noShadow",
      type: "actions",
      block: { 
         name: "withdrawNum_noShadow", 
         params: [null]
      },
      func: function(value, callback) {
         if((typeof value) == "function") {
            this.callCallback(value);
            return;
         }
         for(var i = 0;i < value;i++) {
            this.withdraw();
         }
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "withdrawNum",
      type: "actions",
      block: { name: "withdrawNum", params: [null], blocklyXml: "<block type='withdrawNum_noShadow'>" +
                              "  <value name='PARAM_0'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"},
      func: function(value, callback) {
         if((typeof value) == "function") {
            this.callCallback(value);
            return;
         }
         for(var i = 0;i < value;i++) {
            this.withdraw();
         }
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "dropNum_noShadow",
      type: "actions",
      block: { 
         name: "dropNum_noShadow", 
         params: [null]
      },
      func: function(value, callback) {
         if((typeof value) == "function") {
            this.callCallback(value);
            return;
         }
         this.drop(value);
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "dropNum",
      type: "actions",
      block: { name: "dropNum", params: [null], blocklyXml: "<block type='dropNum_noShadow'>" +
                              "  <value name='PARAM_0'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"},
      func: function(value, callback) {
         if((typeof value) == "function") {
            this.callCallback(value);
            return;
         }
         this.drop(value);
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "shoot_noShadow",
      type: "actions",
      block: { 
         name: "shoot_noShadow", 
         params: [null]
      },
      func: function(value, callback) {
         if((typeof value) == "function") {
            this.callCallback(value);
            return;
         }
         if(this.isOn(function(obj) { return obj.isLaser === true; })) {
            this.shoot(this.getRobot().row, this.getRobot().col, value);
            if(this.display) {
               var robot = this.getRobot();
               var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
                  return obj.isLaser === true;
               });
               
               if(lasers.length != 0) {
                  lasers[0].element.toFront();
               }
               
               robot.element.toFront();
            }
         }
         else {
            throw(window.languageStrings.messages.failureLaser);
         }
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "shoot",
      type: "actions",
      block: { name: "shoot", params: [null], blocklyXml: "<block type='shoot_noShadow'>" +
                              "  <value name='PARAM_0'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"},
      func: function(value, callback) {
         if((typeof value) == "function") {
            this.callCallback(value);
            return;
         }
         if(this.isOn(function(obj) { return obj.isLaser === true; })) {
            if (!(value % 1 === 0)){
               throw(window.languageStrings.messages.failureDirection)
            }
            this.shoot(this.getRobot().row, this.getRobot().col, value);
            if(this.display) {
               var robot = this.getRobot();
               var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
                  return obj.isLaser === true;
               });
               
               if(lasers.length != 0) {
                  lasers[0].element.toFront();
               }
               
               robot.element.toFront();
            }
         }
         else {
            throw(window.languageStrings.messages.failureLaser);
         }
         this.waitDelay(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "shootCondition_noShadow",
      type: "actions",
      block: { 
         name: "shootCondition_noShadow", 
         params: [null],
         yieldsValue: 'bool'
      },
      func: function(value, callback) {
         if((typeof value) == "function") {
            this.callCallback(value);
            return;
         }
         
         if(this.isOn(function(obj) { return obj.isLaser === true; })) {
            var retour = this.shoot(this.getRobot().row, this.getRobot().col, value);
            if(this.display) {
               var robot = this.getRobot();
               var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
                  return obj.isLaser === true;
               });
               
               if(lasers.length != 0) {
                  lasers[0].element.toFront();
               }
               
               robot.element.toFront();
            }
            this.waitDelay(callback, retour);
         }
         else {
            throw(window.languageStrings.messages.failureLaser);
            this.callCallback(callback);
         }
      }
   });
   
   infos.newBlocks.push({
      name: "shootCondition",
      type: "actions",
      block: { name: "shootCondition", blocklyXml: "<block type='shootCondition_noShadow'>" +
                              "  <value name='PARAM_0'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"},
      func: function(value, callback) {
         if((typeof value) == "function") {
            this.callCallback(value);
            return;
         }
         
         if(this.isOn(function(obj) { return obj.isLaser === true; })) {
            var retour = this.shoot(this.getRobot().row, this.getRobot().col, value);
            if(this.display) {
               var robot = this.getRobot();
               var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
                  return obj.isLaser === true;
               });
               
               if(lasers.length != 0) {
                  lasers[0].element.toFront();
               }
               
               robot.element.toFront();
            }
            this.waitDelay(callback, retour);
         }
         else {
            throw(window.languageStrings.messages.failureLaser);
            this.callCallback(callback);
         }
      }
   });
   
   infos.newBlocks.push({
      name: "connect",
      type: "actions",
      block: { name: "connect" },
      func: function(callback) {
         this.connect();
         this.callCallback(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "onMale",
      type: "sensors",
      block: { name: "onMale", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.isOn(function(obj) { return obj.plugType > 0; }));
      }
   });
   
   infos.newBlocks.push({
      name: "onFemale",
      type: "sensors",
      block: { name: "onFemale", yieldsValue: 'bool' },
      func: function(callback) {
         this.callCallback(callback, this.isOn(function(obj) { return obj.plugType < 0; }));
      }
   });
   
   infos.newBlocks.push({
      name: "dropPlatformInFront",
      type: "actions",
      block: { name: "dropPlatformInFront" },
      func: function(callback) {
         if(this.nbPlatforms == 0)
            throw(window.languageStrings.messages.failureNotEnoughPlatform);
            
         var coords = {row: this.coordsInFront().row + 1, col: this.coordsInFront().col};
         if(this.getItemsOn(coords.row, coords.col, function(item) { return item.isObstacle === true; }).length != 0) {
            throw(window.languageStrings.messages.failureDropPlatform);
         }
         this.nbPlatforms -= 1;
         this.dropObject({type: "platform"}, coords);
         this.callCallback(callback);
      }
   });
   
   infos.newBlocks.push({
      name: "dropPlatformAbove",
      type: "actions",
      block: { name: "dropPlatformAbove" },
      func: function(callback) {
         if(this.nbPlatforms == 0)
            throw(window.languageStrings.messages.failureNotEnoughPlatform);
            
         var coords = {row: this.getRobot().row - 1, col: this.getRobot().col};
         if(this.getItemsOn(coords.row, coords.col, function(item) { return item.isObstacle === true; }).length != 0) {
            throw(window.languageStrings.messages.failureDropPlatform);
         }
         this.nbPlatforms -= 1;
         this.dropObject({type: "platform"}, coords);
         this.callCallback(callback);
      }
   });
   
   var context = quickAlgoContext(display, infos);
   context.robot = {};
   context.customBlocks = {
      robot: {
         actions: [],
         sensors: []
      }
   };

   // Export context params and strings so that they are available for migration purposes
   context.contextParams = contextParams;
   context.contextStrings = contextStrings;

   for(var command in infos.newBlocks) {
      cmd = infos.newBlocks[command];
      context.customBlocks.robot[cmd.type].push(cmd.block);
      if(cmd.strings) {
         for(var language in cmd.strings) {
            for(var type in cmd.strings[language]) {
               localLanguageStrings[language][type][cmd.name] = cmd.strings[language][type];
            }
         }
      }
      if(cmd.func) {
         context.robot[cmd.name] = cmd.func.bind(context);
      }
   }
   
   var strings = context.setLocalLanguageStrings(localLanguageStrings);
   
   if(infos.languageStrings != undefined) {
      context.importLanguageStrings(infos.languageStrings.blocklyRobot_lib, strings);
      var taskMessages = infos.languageStrings.blocklyRobot_lib && infos.languageStrings.blocklyRobot_lib.messages;
      if(taskMessages && strings.messages) {
         for(var msgKey in taskMessages) {
            if(taskMessages[msgKey + 'Singular'] === undefined) {
               delete strings.messages[msgKey + 'Singular'];
            }
         }
      }
   }
   
   var cells = [];
   var colsLabels = [];
   var rowsLabels = [];
   var cardLabels = [];
   var scale = 1;
   var paper;
   
   if(infos.leftMargin === undefined) {
      infos.leftMargin = 10;
   }
   if(infos.rightMargin === undefined) {
      infos.rightMargin = 10;
   }
   if(infos.bottomMargin === undefined) {
      infos.bottomMargin = 10;
   }
   if(infos.topMargin === undefined) {
      if(infos.showLabels) {
         infos.topMargin = 10;
      }
      else {
         infos.topMargin = infos.cellSide / 2;
      }
   }
   if (infos.showLabels) {
      infos.leftMargin += infos.cellSide;
      infos.topMargin += infos.cellSide;
   }
   if (infos.showCardinals) {
      infos.leftMargin += infos.cellSide * 1.8;
      infos.topMargin += infos.cellSide;
      //infos.rightMargin += infos.cellSide;
      infos.rightMargin += infos.cellSide * 1.2;
      infos.bottomMargin += infos.cellSide;
   }

   var innerState = {};

   
   switch (infos.blocklyColourTheme) {
      case "bwinf":
         context.provideBlocklyColours = function() {
            return {
               categories: {
                  logic: "#81b31d",
                  loops: "#2fb5bd",
                  math: "#3950a5",
                  texts: "#6638a5",
                  lists: "#d8892b",
                  colour: 310,
                  read: "#a50101",
                  print: "#d8892b",
                  variables: "#a5416b",
                  sensors: "#2b7ca5",
                  actions: "#723ca5",
                  functions: "#9911a5",
                  _default: 0
               },
               blocks: {}
            };
         }
         break;
      default:
         // Nothing yet.
   }

   var hasGrid = function() {
      return !!context.tiles;
   };
   
   context.reset = function(gridInfos) {
      if(gridInfos && gridInfos.tiles) {
         context.gridInfos = gridInfos;
         context.tiles = gridInfos.tiles;
         context.initItems = gridInfos.initItems;
         context.nbRows = context.tiles.length;
         context.nbCols = context.tiles[0].length;
      }
      context.nbPlatforms = infos.nbPlatforms;
      
      context.items = [];
      context.multicell_items = [];
      
      context.last_connect = undefined;
      context.wires = [];
      
      context.lost = false;
      context.success = false;
      context.nbMoves = 0;
      context.time = 0;
      context.bag = [];
      
      if(infos.bagInit != undefined) {
         for(var i = 0;i < infos.bagInit.count;i++) {
            var item = {};
            
            var initItem = infos.itemTypes[infos.bagInit.type];
            
            item.type = infos.bagInit.type;
            item.side = 0;
            item.offsetX = 0;
            item.offsetY = 0;
            item.nbStates = 1;
            item.zOrder = 0;
            for(var property in initItem) {
               item[property] = initItem[property];
            }
            
            context.bag.push(item);
         }
      }
      
      if(context.display) {
         this.delayFactory.destroyAll();
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         if(hasGrid()) {
            paper = this.raphaelFactory.create("paperMain", "grid", infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
            resetBoard();
            resetItems();
            context.updateScale();
         }
         else {
            paper = undefined;
         }
         $("#nbMoves").html(context.nbMoves);
      }
      else if(hasGrid()) {
         resetItems();
      }
   };

   context.redrawDisplay = function() {
      if(context.display) {
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         paper = this.raphaelFactory.create("paperMain", "grid", infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
         resetBoard();
         redisplayAllItems();
         context.updateScale();
         $("#nbMoves").html(context.nbMoves);
      }
   }

   context.getInnerState = function() {
      var removeItemElement = function (item) {
         var modifiedItem = Object.assign({}, item);
         delete modifiedItem.element;
         return modifiedItem;
      };
      innerState.items = context.items.map(removeItemElement);
      innerState.multicell_items = context.multicell_items.map(removeItemElement);
      innerState.last_connect = context.last_connect;
      innerState.wires = context.wires.map(removeItemElement);
      innerState.nbMoves = context.nbMoves;
      innerState.time = context.time;
      innerState.bag = context.bag.map(removeItemElement);

      return innerState;
   };

   context.implementsInnerState = function () {
      return true;
   }

   context.reloadInnerState = function(data) {
      innerState = data;
      context.items = data.items;
      context.multicell_items = data.multicell_items;
      context.last_connect = data.last_connect;
      context.wires = data.wires;
      context.nbMoves = data.nbMoves;
      context.time = data.time;
      context.bag = data.bag;
   };

   context.unload = function() {
      if(context.display && paper != null) {
         paper.remove();
      }
   };
   
   var itemAttributes = function(item) {
      var itemType = infos.itemTypes[item.type];
      var x = (infos.cellSide * item.col + item.offsetX + infos.leftMargin) * scale;
      var y = (infos.cellSide * item.row - (item.side - infos.cellSide) + item.offsetY + infos.topMargin) * scale;
      var xClip = x;
      if(item.dir != undefined) {
         var dirToState = [0, 2, 4, 6];
         x = x - (dirToState[item.dir] * item.side * scale);
      }
      var clipRect = "" + xClip + "," + y + "," + (item.side * scale) + "," + (item.side * scale);
      if((!itemType.img && !item.img) && (!itemType.color && !item.color)) {
         x += item.side * scale / 2;
         y += item.side * scale / 2;
      }
      
      var ret = {x: x, y: y, width: item.side * item.nbStates * scale, height: item.side * scale, "clip-rect": clipRect};
      return ret;
   }
   
   var resetBoard = function() {
      for(var iRow = 0;iRow < context.nbRows;iRow++) {
         cells[iRow] = [];
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            cells[iRow][iCol] = paper.rect(0, 0, 10, 10);
            if(context.tiles[iRow][iCol] == 0)
               cells[iRow][iCol].attr({'stroke-width': '0'});
            if(infos.backgroundColor && context.tiles[iRow][iCol] != 0)
               cells[iRow][iCol].attr({'fill': infos.backgroundColor});
            if(infos.noBorders) {
               if (context.tiles[iRow][iCol] != 0) {
                  cells[iRow][iCol].attr({'stroke': infos.backgroundColor});
               }
            } else {
               if (infos.borderColor) {
                  cells[iRow][iCol].attr({'stroke': infos.borderColor});
               }
            }
            
         }
      }
      if(infos.showLabels) {
         for(var iRow = 0;iRow < context.nbRows;iRow++) {
            rowsLabels[iRow] = paper.text(0, 0, (iRow + 1));
         }
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            colsLabels[iCol] = paper.text(0, 0, (iCol + 1));
         }
      }
      if (infos.showCardinals) {
         cardLabels = [
            paper.text(0, 0, strings.cardinals.north),
            paper.text(0, 0, strings.cardinals.south),
            paper.text(0, 0, strings.cardinals.west),
            paper.text(0, 0, strings.cardinals.east)
            ];
      }
   };
   
   var resetItem = function(initItem, redisplay, onTop) {
      if(redisplay === undefined)
         redisplay = true;
      var item = {};
      if (onTop === true) {
         context.items.unshift(item);
      } else {
         context.items.push(item);
      }
      for(var property in initItem) {
         item[property] = initItem[property];
      }
      
      item.side = 0;
      item.offsetX = 0;
      item.offsetY = 0;
      item.nbStates = 1;
      item.zOrder = 0;
      for(var property in infos.itemTypes[item.type]) {
         item[property] = infos.itemTypes[item.type][property];
      }
      
      if(context.display && redisplay) {
         redisplayItem(item);
      }
   };
   
   var resetItems = function() {
      context.items = [];
      var itemTypeByNum = {};
      for(var type in infos.itemTypes) {
         var itemType = infos.itemTypes[type];
         if(itemType.num != undefined) {
            itemTypeByNum[itemType.num] = type;
         }
      }
      for(var iRow = 0;iRow < context.nbRows;iRow++) {
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            var itemTypeNum = context.tiles[iRow][iCol];
            if(itemTypeByNum[itemTypeNum] != undefined) {
               resetItem({
                  row: iRow,
                  col: iCol,
                  type: itemTypeByNum[itemTypeNum]
               }, false);
            }
         }
      }
      var initItems = context.initItems || [];
      for(var iItem = initItems.length - 1;iItem >= 0;iItem--) {
         resetItem(initItems[iItem], false);
      }
      
      if(context.display)
         redisplayAllItems();
   };
   
   var resetItemsZOrder = function(row, col) {
      var cellItems = [];
      for(var iItem = context.items.length - 1;iItem >= 0;iItem--) {
         var item = context.items[iItem];
         if((item.row == row) && (item.col == col)) {
            cellItems.push(item);
         }
      }
      cellItems.sort(function(itemA, itemB) {
         if(itemA.zOrder < itemB.zOrder) {
            return -1;
         }
         if(itemA.zOrder > itemB.zOrder) {
            return 1;
         }
         return 0;
      });
      for(var iItem = 0;iItem < cellItems.length;iItem++) {
         if(cellItems[iItem].element)
            cellItems[iItem].element.toFront();
      }
   };

   var redisplayItem = function(item, resetZOrder) {
      if(context.display !== true)
         return;
      if(resetZOrder === undefined)
         resetZOrder = true;
      
      if(item.element !== undefined) {
         item.element.remove();
      }
      var x = (infos.cellSide * item.col + infos.leftMargin) * scale;
      var y = (infos.cellSide * item.row + infos.topMargin) * scale;
      var itemType = infos.itemTypes[item.type];
      
      if(item.customDisplay !== undefined) {
      	item.customDisplay(item);
      }
      
      if(item.img) {
         item.element = paper.image(imgUrlWithPrefix(item.img), x, y, item.side * item.nbStates * scale, item.side * scale);
      }
      else if(item.value !== undefined) {
         var fontColor = item.fontColor;
         if(fontColor === undefined) { fontColor = "black"; }
         
         var value;
         if(typeof(item.value) == "function")
            value = item.value(item);
         else
            value = item.value;
         
         item.element = paper.text(x + item.side * scale / 2, y + item.side * scale / 2, value).attr({
            "font-size": item.side * scale / 2,
            "fill": fontColor,
         });
         
         if(item.fontBold === true) {
            item.element.attr({
               "font-weight": "bold"
            });
         }
      }
      else if(item.color !== undefined) {
         item.element = paper.rect(0, 0, item.side, item.side).attr({"fill": item.color});
      }
      if(item.element !== undefined)
         item.element.attr(itemAttributes(item));
      if(resetZOrder)
         resetItemsZOrder(item.row, item.col);
   };
   
   context.updateScale = function() {
      if(!context.display) {
         return;
      }
      if(paper == null) {
         return;
      }
      
      if(window.quickAlgoResponsive) {
         var areaWidth = Math.max(200, $('#grid').width()-24);
         var areaHeight = Math.max(150, $('#grid').height()-24);
      } else {
         var areaWidth = 400;
         var areaHeight = 600;
      }
      var newCellSide = 0;
      if(context.nbCols && context.nbRows) {
         var marginAsCols = (infos.leftMargin + infos.rightMargin) / infos.cellSide;
         var marginAsRows = (infos.topMargin + infos.bottomMargin) / infos.cellSide;
         newCellSide = Math.min(infos.cellSide, Math.min(areaWidth / (context.nbCols + marginAsCols), areaHeight / (context.nbRows + marginAsRows)));
      }
      scale = newCellSide / infos.cellSide;
      var paperWidth = (infos.cellSide * context.nbCols + infos.leftMargin + infos.rightMargin) * scale;
      var paperHeight = (infos.cellSide * context.nbRows + infos.topMargin + infos.bottomMargin) * scale;
      paper.setSize(paperWidth, paperHeight);
      
      for(var iRow = 0;iRow < context.nbRows;iRow++) {
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            if(cells[iRow][iCol] === undefined)
               continue;
            var x = (infos.cellSide * iCol + infos.leftMargin) * scale;
            var y = (infos.cellSide * iRow + infos.topMargin) * scale;
            cells[iRow][iCol].attr({x: x, y: y, width: infos.cellSide * scale, height: infos.cellSide * scale});
         }
      }
      var textFontSize = {"font-size": infos.cellSide * scale / 2};
      if(infos.showLabels) {
         for(var iRow = 0;iRow < context.nbRows;iRow++) {
            var x = (infos.leftMargin - infos.cellSide / 2) * scale;
            var y = (infos.cellSide * (iRow + 0.5) + infos.topMargin) * scale;
            rowsLabels[iRow].attr({x: x, y: y}).attr(textFontSize);
         }
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            var x = (infos.cellSide * iCol + infos.leftMargin + infos.cellSide / 2) * scale;
            var y = (infos.topMargin - infos.cellSide / 2) * scale;
            colsLabels[iCol].attr({x: x, y: y}).attr(textFontSize);
         }
      }
      if (infos.showCardinals) {
         var middleX = (infos.leftMargin + infos.cellSide * context.nbCols / 2) * scale;
         var middleY = (infos.topMargin + infos.cellSide * context.nbRows / 2) * scale;
         cardLabels[0].attr({x: middleX, y: (infos.topMargin - (infos.showLabels ? infos.cellSide : 0) - infos.cellSide / 2) * scale}).attr(textFontSize);
         cardLabels[1].attr({x: middleX, y: paperHeight + (infos.cellSide / 2 - infos.bottomMargin) * scale}).attr(textFontSize);
         cardLabels[2].attr({x: (infos.leftMargin - (infos.showLabels ? infos.cellSide : 0) - infos.cellSide * 1.8 / 2) * scale, y: middleY}).attr(textFontSize);
         //cardLabels[3].attr({x: paperWidth + (infos.cellSide / 2 - infos.rightMargin) * scale, y: middleY}).attr(textFontSize);
         cardLabels[3].attr({x: paperWidth + (infos.cellSide / 2 - infos.rightMargin + 12) * scale, y: middleY}).attr(textFontSize);
      }
      
      redisplayAllItems();      
   };
   
   var redisplayAllItems = function() {
      if(context.display !== true)
         return;
      for(var iItem = 0;iItem < context.items.length;iItem++) {
         var item = context.items[iItem];
         redisplayItem(item, false);
      }
      
      for(var iItem = 0;iItem < context.multicell_items.length;iItem++) {
         var item = context.multicell_items[iItem];
         item.redisplay();
      }
      
      var cellItems = [];
      
      for(var iItem = context.items.length - 1;iItem >= 0;iItem--) {
         var item = context.items[iItem];
         cellItems.push(item);
      }
      
      for(var iItem = 0;iItem < context.multicell_items.length;iItem++) {
         var item = context.multicell_items[iItem];
         cellItems.push(item);
      }
      
      cellItems.sort(function(itemA, itemB) {
         if(itemA.zOrder < itemB.zOrder) {
            return -1;
         }
         if(itemA.zOrder > itemB.zOrder) {
            return 1;
         }
         return 0;
      });
      for(var iItem = 0;iItem < cellItems.length;iItem++) {
         if(cellItems[iItem].element !== undefined)
            cellItems[iItem].element.toFront();
      }
   };
   
   context.advanceTime = function(epsilon) {
      var items = [];
      for(var id in context.items) {
         items.push(context.items[id]);
      }
      
      for(var iTime = 0;iTime < epsilon;iTime++) {
         context.time++;
         for(var id in items) {
            if(items[id] !== undefined && items[id].action !== undefined) {
               items[id].action.bind(context)(items[id], context.time);
            }
         }
         
         var robot = this.getRobot();
         if(this.hasOn(robot.row, robot.col, function(item) { return item.isProjectile === true; })) {
            throw(context.strings.messages.failureProjectile);
         }
      }
   };
   
   context.getRobotId = function() {
      for(var id in context.items) {
         if(context.items[id].isRobot != undefined) {
            return id;
         }
      }
      return undefined;
   };
   
   context.getRobot = function() {
      return context.items[context.getRobotId()];
   };
   
   context.getInfo = function(name) {
      return infos[name];
   };
   
   context.setInfo = function(name, value) {
      infos[name] = value;
   };
   
   context.hasOn = function(row, col, filter) {
      for(var id in context.items) {
         var item = context.items[id];
         if(item.row == row && item.col == col && filter(item)) {
            return true;
         }
      }
      return false;
   };
   
   context.setIndexes = function() {
      for(var id in context.items) {
         var item = context.items[id];
         item.index = id;
      }
   }
   
   context.getItemsOn = function(row, col, filter) {
      if(filter === undefined) {
         filter = function(obj) { return true; };
      }
      var selected = [];
      for(var id in context.items) {
         var item = context.items[id];
         if(item.row == row && item.col == col && filter(item)) {
            selected.push(item);
         }
      }
      return selected;
   };

   context.countFilter = function (filter) {
      var filterCount = 0;
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            filterCount += context.getItemsOn(row, col, function(obj) { return filter(obj); }).length;
         }
      }

      for(var item in context.bag) {
         filterCount += filter(context.bag[item]) ? 1 : 0;
      }

      return filterCount;
   };

   context.isOn = function(filter) {
      var item = context.getRobot();
      return context.hasOn(item.row, item.col, filter);
   };
   
   context.isInFront = function(filter) {
      var coords = context.coordsInFront();
      return context.hasOn(coords.row, coords.col, filter);
   };
   
   context.isInGrid = function(row, col) {
      if(row < 0 || col < 0 || row >= context.nbRows || col >= context.nbCols) {
         return false;
      }
      if (context.tiles[row][col] == 0) {
         return false;
      }
      return true;
   };
   
   context.tryToBeOn = function(row, col) {
      // Returns whether the robot can move to row, col
      // true : yes, false : no but move ignored, string : no and throw error
      if(!context.isInGrid(row, col)) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.leavesGrid;
      }
      
      if(context.hasOn(row, col, function(item) { return item.isObstacle === true; })) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.obstacle;
      }
      
      if(context.hasOn(row, col, function(item) { return item.isProjectile === true; })) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.failureProjectile;
      }
      return true;
   };
   
   context.coordsInFront = function(dDir, mult) {
      if(dDir === undefined)
         dDir = 0;
      if(mult === undefined)
         mult = 1;
      var item = context.getRobot();
      var lookDir = (item.dir + dDir + 4) % 4;
      var delta = [[0,1],[1,0],[0,-1],[-1,0]];
      return {
         row: item.row + delta[lookDir][0] * mult,
         col: item.col + delta[lookDir][1] * mult
      };
   };
   
   context.isCrossing = function(wireA, wireB) {
      function crossProduct(pointA, pointB, pointC) {
         return (pointB[0] - pointA[0]) * (pointC[1] - pointA[1]) - (pointB[1] - pointA[1]) * (pointC[0] - pointA[0]);
      }
      
      function onLine(segment, point) {
         return (Math.min(segment[0][0], segment[1][0]) <= point[0] && point[0] <= Math.max(segment[0][0], segment[1][0]))
          && (Math.min(segment[0][1], segment[1][1]) <= point[1] && point[1] <= Math.max(segment[0][1], segment[1][1]));
      }
      
      if(crossProduct(wireA[0], wireA[1], wireB[0]) == 0 && crossProduct(wireA[0], wireA[1], wireB[1]) == 0) {
         return onLine(wireA, wireB[0]) || onLine(wireA, wireB[1]) || onLine(wireB, wireA[0]) || onLine(wireB, wireA[1]);
      }
      return (crossProduct(wireA[0], wireA[1], wireB[0])
      * crossProduct(wireA[0], wireA[1], wireB[1]) <= 0) &&
      (crossProduct(wireB[0], wireB[1], wireA[0])
      * crossProduct(wireB[0], wireB[1], wireA[1]) <= 0);
   }
   
   context.moveRobot = function(newRow, newCol, newDir, callback) {
      var iRobot = context.getRobotId();
      var item = context.items[iRobot];
      if (context.display) 
         item.element.toFront();
      var animate = (item.row != newRow) || (item.col != newCol) || (newDir == item.dir);
      
      if((item.dir != newDir) && ((item.row != newRow) || (item.col != newCol))) {
         if(item.dir !== undefined)
            item.dir = newDir;
         if(context.display) {
            var attr = itemAttributes(item);
            item.element.attr(attr);
         }
      }
      
      if(item.dir !== undefined)
         item.dir = newDir;
      
      item.row = newRow;
      item.col = newCol;
      
      context.withdraw(function(obj) { return obj.autoWithdraw === true; }, false);
      
      if(context.display) {
         attr = itemAttributes(item);
         if(infos.actionDelay > 0) {
            if(animate) {
               context.raphaelFactory.animate("animRobot" + iRobot + "_" + Math.random(), item.element, attr, infos.actionDelay);
            } else {
               context.delayFactory.createTimeout("moveRobot" + iRobot + "_" + Math.random(), function() {
                  item.element.attr(attr);
               }, infos.actionDelay / 2);
            }
         } else {
            item.element.attr(attr);
         }
         $("#nbMoves").html(context.nbMoves);
      }
      
      context.advanceTime(1);
      if(callback) {
         context.waitDelay(callback);
      }
   };
   
   context.moveItem = function(item, newRow, newCol) {
      var animate = (item.row != newRow) || (item.col != newCol);
      var robot = context.getRobot();
      if(context.display) {
         resetItemsZOrder(newRow, newCol);
         resetItemsZOrder(item.row, item.col);
         resetItemsZOrder(robot.row, robot.col);
      }
      item.row = newRow;
      item.col = newCol;
      
      if(context.display) {
         if(animate) {
            attr = itemAttributes(item);
            context.raphaelFactory.animate("animItem" + "_" + Math.random(), item.element, attr, infos.actionDelay);
         }
         else {
            attr = itemAttributes(item);
            if(infos.actionDelay > 0) {
               context.delayFactory.createTimeout("moveItem" + "_" + Math.random(), function() {
                  item.element.attr(attr);
               }, infos.actionDelay / 2);
            } else {
               item.element.attr(attr);
            }
         }
      }
   };
   
   context.moveProjectile = function(item) {
      if(!context.isInGrid(item.row + 1, item.col)) {
         context.destroy(item);
      }
      
      if(context.hasOn(item.row + 1, item.col, function(item) { return item.isObstacle === true; } )) {
         context.destroy(item);
         context.dropObject({type: "dispersion"}, {row: item.row + 1, col: item.col});
         return;
      }
      
      if(context.hasOn(item.row + 1, item.col, function(item) { return item.isRobot === true; } )) {
         context.destroy(item);
         context.dropObject({type: "dispersion_robot"}, {row: item.row + 1, col: item.col});
         return;
      }
      
      context.moveItem(item, item.row + 1, item.col);
      return;
   };
   
   context.destroy = function(item) {
      context.setIndexes();
      context.items.splice(item.index, 1);

      if(context.display) {
         item.element.remove();
      }
   };

   context.destroyMask = function(row, col) {
      var masks = context.getItemsOn(row, col, function(obj) { return obj.isMask === true; });

      for(var iMask = 0;iMask < masks.length;iMask++) {
          context.destroy(masks[iMask]);
      }
   };

   context.destroyMasks = function() {
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            context.destroyMask(row, col);
         }
      }
   };

   context.leave = function(error) {
      context.destroyMasks();
      throw(error);
   };

   context.fall = function(item, row, col, callback) {
      var startRow = row;
      var platforms = context.getItemsOn(row + 1, col, function(obj) { return obj.isObstacle === true; });
      
      while(context.isInGrid(row + 1, col) && platforms.length == 0) {
         row++;
         platforms = context.getItemsOn(row + 1, col, function(obj) { return obj.isObstacle === true; });
      }
      
      if(!context.isInGrid(row + 1, col)) {
         throw(context.strings.messages.falls);
      }
      
      if(row - startRow > infos.maxFallAltitude) {
         throw(context.strings.messages.willFallAndCrash);
      }
      context.nbMoves++;
      context.moveRobot(row, col, item.dir, callback);
   };
   
   context.jump = function(callback) {
      if(!infos.hasGravity) {
         throw("Error: can't jump without gravity");
      }
      
      var item = context.getRobot();
      if(!context.isInGrid(item.row - 1, item.col)) {
         throw(context.strings.messages.jumpOutsideGrid);
      }
      var obstacle = context.getItemsOn(item.row - 2, item.col, function(obj) { return obj.isObstacle === true || obj.isProjectile === true; });
      if(obstacle.length > 0) {
         throw(context.strings.messages.jumpObstacleBlocking);
      }
      var platforms = context.getItemsOn(item.row - 1, item.col, function(obj) { return obj.isObstacle === true; });
      if(platforms.length == 0) {
         throw(context.strings.messages.jumpNoPlatform);
      }
      var fake = context.getItemsOn(item.row - 1, item.col, function(obj) { return obj.isFake === true; });
      if(fake.length != 0) {
         throw(context.strings.messages.jumpObstacleBlocking);
      }
      context.nbMoves++;
      context.moveRobot(item.row - 2, item.col, item.dir, callback);
   };
   
   context.withdraw = function(filter, errorWhenEmpty) {
      if(filter === undefined) {
         filter = function(obj) { return true; };
      }
      if(errorWhenEmpty === undefined) {
         errorWhenEmpty = true;
      }
      var item = context.getRobot();
      var withdrawables = context.getItemsOn(item.row, item.col, function(obj) { return obj.isWithdrawable === true && filter(obj); });
      if(withdrawables.length == 0) {
         if(errorWhenEmpty)
            throw(context.strings.messages.nothingToPickUp);
         return;
      }
      
      if(infos.bagSize != undefined && context.bag.length == infos.bagSize) {
         throw(context.strings.messages.tooManyObjects);
      }
      
      var withdrawable = withdrawables[0];
      context.setIndexes();
      context.items.splice(withdrawable.index, 1);
      if (withdrawable.isFake !== true){
         context.bag.push(withdrawable);
      }
      if(context.display) {
         function removeWithdrawable() {
            withdrawable.element.remove();
            var items = context.getItemsOn(item.row, item.col);
            for(var i = 0; i < items.length ; i++) {
               redisplayItem(items[i]);
            }
         }

         if (infos.actionDelay > 0) {
            context.delayFactory.createTimeout("takeItem_" + Math.random(), removeWithdrawable, infos.actionDelay);
         } else {
            removeWithdrawable();
         }
      }
   };
   
   context.checkContainer = function(coords) {
      var containers = context.getItemsOn(coords.row, coords.col, function(obj) { return (obj.isContainer === true) && (!obj.isFake) });
      if(containers.length != 0) {
         
         var container = containers[0];
         if(container.containerSize == undefined && container.containerFilter == undefined) {
            container.containerSize = 1;
         }
         var filter;
         if(container.containerFilter == undefined)
            filter = function(obj) { return obj.isWithdrawable === true; };
         else
            filter = function(obj) { return obj.isWithdrawable === true && container.containerFilter(obj) };
         
         if(container.containerSize != undefined && context.getItemsOn(coords.row, coords.col, filter).length > container.containerSize) {
            throw(window.languageStrings.messages.failureDropObject);
            return;
         }

         

         if(container.containerFilter != undefined) {
            if(context.hasOn(coords.row, coords.col, function(obj) { return obj.isWithdrawable === true && !container.containerFilter(obj) }) && (context.infos.blockingFilter !== false)) {

               throw(window.languageStrings.messages.failureDropObject);
               return;
            }
         }
      }
   };
   
   context.drop = function(count, coords, filter) {
      if(count === undefined) {
         count = 1;
      }
      if(filter === undefined) {
         filter = function(obj) { return true; };
      }
      if(coords == undefined) {
         var item = context.getRobot();
         coords = {row: item.row, col: item.col};
      }
      
      for(var i = 0;i < count;i++) {
         if(context.bag.length == 0) {
            throw(context.strings.messages.emptyBag);
         }
         
         var object = context.bag.pop();
         object.row = coords.row;
         object.col = coords.col;
         var itemsOn = context.getItemsOn(coords.row, coords.col);
         var maxi = object.zOrder;
         for(var item in itemsOn) {
            if(itemsOn[item].isWithdrawable === true && itemsOn[item].zOrder > maxi) {
               maxi = itemsOn[item].zOrder;
            }
            redisplayItem(item);
         }
         
         object.zOrder = maxi + 0.000001;
         resetItem(object, true, infos.dropOnTop === true);
         
         context.checkContainer(coords);
      }
      
      redisplayItem(this.getRobot());
   };
   
   context.dropObject = function(object, coords) {
      if(coords == undefined) {
         var item = context.getRobot();
         coords = {row: item.row, col: item.col};
      }
      
      if(!context.isInGrid(coords.row, coords.col)) {
         throw(window.languageStrings.messages.failureDropOutside);
         return;
      }
      
      object.row = coords.row;
      object.col = coords.col;
      
      var itemsOn = context.getItemsOn(coords.row, coords.col);
      var maxi = object.zOrder;
      if(maxi === undefined) {
         maxi = 0;
      }
      for(var item in itemsOn) {
         if(itemsOn[item].isWithdrawable === true && itemsOn[item].zOrder > maxi) {
            maxi = itemsOn[item].zOrder;
         }
         redisplayItem(item);
      }
      resetItem(object, true);
      context.checkContainer(coords);
      redisplayItem(this.getRobot());
   };
   
   context.turnLeft = function(callback) {
      var robot = context.getRobot();
      context.moveRobot(robot.row, robot.col, (robot.dir + 3) % 4, callback);
   };
   
   context.turnRight = function(callback) {
      var robot = context.getRobot();
      context.moveRobot(robot.row, robot.col, (robot.dir + 1) % 4, callback);
   };
   
   context.turnAround = function(callback) {
      var robot = context.getRobot();
      context.moveRobot(robot.row, robot.col, (robot.dir + 2) % 4, callback);
   };
   
   context.forward = function(callback) {
      var robot = context.getRobot();
      var coords = context.coordsInFront();
      var ttbo = context.tryToBeOn(coords.row, coords.col);
      if(ttbo === true) {
         if(infos.hasGravity) {
            context.fall(robot, coords.row, coords.col, callback);
         } else {
            context.nbMoves++;
            context.moveRobot(coords.row, coords.col, robot.dir, callback);
         }
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(robot.row + (coords.row - robot.row) / 4, robot.col + (coords.col - robot.col) / 4, robot.dir);
         throw ttbo;
      }
   };
   
   context.backwards = function(callback) {
      var robot = context.getRobot();
      var coords = context.coordsInFront(2);
      var ttbo = context.tryToBeOn(coords.row, coords.col);
      if(ttbo === true) {
         if(infos.hasGravity) {
            context.fall(robot, coords.row, coords.col, callback);
         } else {
            context.nbMoves++;
            context.moveRobot(coords.row, coords.col, robot.dir, callback);
         }
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(robot.row + (coords.row - robot.row) / 4, robot.col + (coords.col - robot.col) / 4, robot.dir);
         throw ttbo;
      }
   };
   
   context.north = function(callback) {
      var item = context.getRobot();
      var ttbo = context.tryToBeOn(item.row - 1, item.col);
      if(ttbo === true) {
         context.nbMoves++;
         context.moveRobot(item.row - 1, item.col, 3, callback);
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(item.row - 1/4, item.col, 3);
         throw ttbo;
      }
   };
   
   context.south = function(callback) {
      var item = context.getRobot();
      var ttbo = context.tryToBeOn(item.row + 1, item.col);
      if(ttbo === true) {
         context.nbMoves++;
         context.moveRobot(item.row + 1, item.col, 1, callback);
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(item.row + 1/4, item.col, 1);
         throw ttbo;
      }
   };
   
   context.east = function(callback) {
      var item = context.getRobot();
      var ttbo = context.tryToBeOn(item.row, item.col + 1);
      if(ttbo === true) {
         context.nbMoves++;
         context.moveRobot(item.row, item.col + 1, 0, callback);
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(item.row, item.col + 1/4, 0);
         throw ttbo;
      }
   };
   
   context.west = function(callback) {
      var item = context.getRobot();
      var ttbo = context.tryToBeOn(item.row, item.col - 1);
      if(ttbo === true) {
         context.nbMoves++;
         context.moveRobot(item.row, item.col - 1, 2, callback);
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(item.row, item.col - 1/4, 2);
         throw ttbo;
      }
   };
   
   context.obstacleInFront = function() {
      return context.isInFront(function(obj) { return obj.isObstacle === true; });
   };
   
   context.platformInFront = function() {
      var coords = context.coordsInFront();
      return context.hasOn(coords.row + 1, coords.col, function(obj) { return obj.isObstacle === true; });
   };
   
   context.platformAbove = function() {
      var robot = context.getRobot();
      return context.hasOn(robot.row - 1, robot.col, function(obj) { return obj.isObstacle === true; });
   };

   context.writeNumber = function(row, col, value) {
      var numbers = context.getItemsOn(row, col, function(obj) { return obj.isWritable === true; });
      if(numbers.length == 0) {
         throw(strings.messages.failureWriteHere);
      }
      
      var number = numbers[0];
      number.value = value;
      // console.log(number.value instanceof number)
      console.log(typeof number.value)
      if(typeof number.value !== "number") {
         throw(strings.messages.failureNothingToWrite)
      }
      if(context.display) {
         redisplayItem(number);
      }
   };
   
   context.readNumber = function(row, col) {
      var numbers = context.getItemsOn(row, col, function(obj) { return obj.value !== undefined; });
      
      if(numbers.length == 0) {
         throw(strings.messages.failureReadHere);
      }
      
      return parseInt(numbers[0].value);
   };
   
   context.pushObject = function(callback) {
      var robot = context.getRobot();
      var coords = context.coordsInFront();
      
      var items = context.getItemsOn(coords.row, coords.col, function(obj) { return obj.isPushable === true ; });
      
      if(items.length == 0) {
         throw(strings.messages.failureNothingToPush);
      }
      
      var coordsAfter = context.coordsInFront(0, 2);
      
      if(!context.isInGrid(coordsAfter.row, coordsAfter.col))
         throw(strings.messages.failureWhilePushing);
      if(context.hasOn(coordsAfter.row, coordsAfter.col, function(obj) { return obj.isObstacle === true; } ))
         throw(strings.messages.failureWhilePushing);
      if(context.tiles[coordsAfter.row][coordsAfter.col] == 0)
         throw(strings.messages.failureWhilePushing);
      
      context.moveItem(items[0], coordsAfter.row, coordsAfter.col);
      
      context.forward(callback);
   };
   
   context.shoot = function(lig, col, dir) {
      dir = dir % 8;
      var dirs = [
         [-1, 0],
         [-1, 1],
         [0, 1],
         [1, 1],
         [1, 0],
         [1, -1],
         [0, -1],
         [-1, -1]
      ];
      
      var lights = context.getItemsOn(lig, col, function(obj) {
         return obj.isLight === true;
      });
      
      for(var light in lights) {
         lights[light].state = 1;
         lights[light].img = lights[light].states[lights[light].state];
         if(context.display)
            redisplayItem(lights[light]);
      }
      
      var x = (infos.cellSide * (col + 0.5) + infos.leftMargin) * scale;
      var y = (infos.cellSide * (lig + 0.5) + infos.topMargin) * scale;
      
      var taille = infos.cellSide;
      
      var findRobot = false;
      
      var plig = lig + dirs[dir][0];
      var pcol = col + dirs[dir][1];
      if(!context.isInGrid(plig, pcol) || context.hasOn(plig, pcol, function(obj) { return obj.isOpaque === true; })) {
         taille /= 2;
         
         findRobot = context.hasOn(plig, pcol, function(obj) { return obj.isRobot === true; });
      }
      else {
         var pdir = dir;
         var mirrors = context.getItemsOn(plig, pcol, function(obj) { return obj.isMirror === true; });
         if(mirrors.length != 0) {
            pdir = mirrors[0].mirrorFunction(dir);
         }
         
         findRobot = context.hasOn(plig, pcol, function(obj) { return obj.isRobot === true; });
         
         if(context.shoot(plig, pcol, pdir)) {
            findRobot = true;
         }
      }
      
      var dx = (taille * dirs[dir][1]) * scale;
      var dy = (taille * dirs[dir][0]) * scale;
      
      if(context.display && paper != undefined) {
         var segment = paper.path("M " + x + " " + y + " l " + dx + " " + dy);
         
         segment.attr({'stroke-width': 5, 'stroke': '#ffff93'});
         
         context.delayFactory.createTimeout("deleteSegement_" + Math.random(), function() {
            segment.remove();
         }, infos.actionDelay * 2);
      }
      
      return findRobot;
   };
   
   context.connect = function() {
      var robot = context.getRobot();
      
      var plugs = context.getItemsOn(robot.row, robot.col, function(obj) { return obj.plugType !== undefined ; });
      
      if(plugs.length == 0) {
         throw(strings.messages.failureNoPlug);
      }
      
      var wires = context.getItemsOn(robot.row, robot.col, function(obj) { return obj.isWire === true; });
      
      if(wires.length != 0) {
         throw(strings.messages.failureAlreadyWired);
      }
      
      this.dropObject({type: "wire", zOrder: 1});
      
      if(this.last_connect !== undefined) {
         if(this.last_connect.plugType + plugs[0].plugType != 0)
            throw(strings.messages.failureWrongPlugType);
            
         function segmentLength(segment) {
            return Math.sqrt((segment[0][0] - segment[1][0]) * (segment[0][0] - segment[1][0]) + (segment[0][1] - segment[1][1]) * (segment[0][1] - segment[1][1]));
         }
         
         var wire = [[this.last_connect.row, this.last_connect.col],[plugs[0].row, plugs[0].col]];
         
         if(segmentLength(wire) > infos.maxWireLength) {
            throw(strings.messages.failureWireTooLong);
         }
         
         var totalLength = segmentLength(wire);
         for(var iWire = 0;iWire < this.wires.length;iWire++) {
            if(this.isCrossing(wire, this.wires[iWire])) {
               throw(strings.messages.failureWireCrossing);
            }
            totalLength += segmentLength(this.wires[iWire]);
         }
         
         if(totalLength > infos.maxTotalLength) {
            throw(strings.messages.failureTotalLengthExceeded);
         }
         
         this.wires.push(wire);
         
         var x = (this.last_connect.col + 0.5) * infos.cellSide + infos.leftMargin;
         var y = (this.last_connect.row + 0.5) * infos.cellSide + infos.topMargin;
         var dx = (plugs[0].col - this.last_connect.col) * infos.cellSide;
         var dy = (plugs[0].row - this.last_connect.row) * infos.cellSide;
         
         var wire_item = {zOrder: 2};
         wire_item.redisplay = function() {
            wire_item.element = paper.path("M " + (x * scale) + " " + (y * scale) + " l " + (dx * scale) + " " + (dy * scale));
            wire_item.element.attr({'stroke-width': 5, 'stroke': '#dd0000'});
         };
         
         this.multicell_items.push(wire_item);
         redisplayAllItems();
         
         this.last_connect = undefined;
      }
      else {
         this.last_connect = plugs[0];
      }
   };

   window.taskGetResourcesPost = function (res, callback) {
      var typeData = contextParams[infos.contextType];
      if (typeData && typeData.itemTypes) {
         for (var key in typeData.itemTypes) {
            var params = typeData.itemTypes[key];
            if (params.img) {
               var imgPath = params.img;
               if (window.modulesPath) {
                  imgPath = window.modulesPath + "img/algorea/" + imgPath;
               }
               res.task.push({ type: 'image', url: imgPath });
            }
         }
      }
      callback(res);
   }

   return context;
};

var getResources = function(subTask) {
   var res = [];
   var type = subTask.gridInfos.contextType;
   var typeData = contextParams[type];
   if(typeData.itemTypes){
      for(var key in typeData.itemTypes){
         var params = typeData.itemTypes[key];
         if(params.img){
            res.task.push({ type: 'image', url: params.img });
         }
      }
   }
   return res
};

var robotEndConditions = {
   checkReachExit: function(context, lastTurn) {
      var robot = context.getRobot();
      if(context.isOn(function(obj) { return obj.isExit === true; })) {
         context.success = true;
         throw(window.languageStrings.messages.successReachExit);
      }
      if(lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failureReachExit);
      }
   },
   checkPickedAllWithdrawables: function(context, lastTurn) {
      var solved = true;
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true; })) {
               solved = false;
            }
         }
      }

      var filterCount = context.countFilter(function(obj) { return obj.isWithdrawable === true; });

      if(solved) {
         context.success = true;
         throw(filterCount <= 1 && window.languageStrings.messages.successPickedAllWithdrawablesSingular
             ? window.languageStrings.messages.successPickedAllWithdrawablesSingular
             : window.languageStrings.messages.successPickedAllWithdrawables);
      }
      if(lastTurn) {
         context.success = false;
         throw(filterCount <= 1 && window.languageStrings.messages.failurePickedAllWithdrawablesSingular
             ? window.languageStrings.messages.failurePickedAllWithdrawablesSingular
             : window.languageStrings.messages.failurePickedAllWithdrawables);
      }
   },
   checkPlugsWired: function(context, lastTurn) {
      var solved = true;
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            if(context.hasOn(row, col, function(obj) { return obj.plugType !== undefined; }) && !context.hasOn(row, col, function(obj) { return obj.isWire === true; })) {
               solved = false;
            }
         }
      }
      
      if(solved) {
         context.success = true;
         throw(window.languageStrings.messages.successPlugsWired);
      }
      if(lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failurePlugsWired);
      }
   },
   checkContainersFilled: function(context, lastTurn) {
      var solved = true;
      
      var messages = [
         'failureContainersFilled',
         'failureContainersFilledLess',
         'failureContainersFilledBag'
      ];
      var message = 2;
      if (context.infos.maxMoves != undefined) {
         if (context.nbMoves > context.infos.maxMoves) {
            context.success = false;
            throw(window.languageStrings.messages.failureTooManyMoves + " : " + context.nbMoves);
         }
      }
      var containersCount = 0;
      var notFilledCount = 0;
      var filledLessCount = 0;
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            var containers = context.getItemsOn(row, col, function(obj) { return (obj.isContainer === true) && (!obj.isFake) });
            if(containers.length != 0) {
               var container = containers[0];
               containersCount++;
               if(container.containerSize == undefined && container.containerFilter == undefined) {
                  container.containerSize = 1;
               }
               var filter;
               if(container.containerFilter == undefined)
                  filter = function(obj) { return obj.isWithdrawable === true; };
               else
                  filter = function(obj) { return obj.isWithdrawable === true && container.containerFilter(obj) };
               
               if(container.containerSize != undefined && context.getItemsOn(row, col, filter).length != container.containerSize) {
                  solved = false;
                  message = Math.min(message, 1);
                  filledLessCount++;
               }
               else if(context.getItemsOn(row, col, filter).length == 0) {
                  solved = false;
                  message = Math.min(message, 0);
                  notFilledCount++;
               }
               
               if(container.containerFilter != undefined) {
                  if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true && !container.containerFilter(obj) })) {
                     solved = false;
                     message = Math.min(message, 0);
                     notFilledCount++;
                  }
                  for(var item in context.bag) {
                     if(filter(context.bag[item]) && context.infos.ignoreBag === undefined) {
                        solved = false;
                        message = Math.min(message, 2);
                     }
                  }
               }
            }
            else {
               if(context.getItemsOn(row, col, function(obj) { return obj.isWithdrawable === true && obj.canBeOutside !== true; }).length > 0) {
                  solved = false;
                  message = Math.min(message, 0);
                  notFilledCount++;
               }
            }
         }
      }

      if(solved) {
         context.success = true;
         throw(window.languageStrings.messages.successContainersFilledSingular && containersCount <= 1
             ? window.languageStrings.messages.successContainersFilledSingular
             : window.languageStrings.messages.successContainersFilled);
      }
      if(lastTurn) {
         context.success = false;

         var singular = (0 === message && notFilledCount <= 1) || (1 === message && filledLessCount <= 1);

         throw(window.languageStrings.messages[messages[message] + 'Singular'] && singular
             ? window.languageStrings.messages[messages[message] + 'Singular']
             : window.languageStrings.messages[messages[message]]);
      }
   },
   checkSpecificCollection: function(context, lastTurn) {
      // Look for a custom filter in the task infos, otherwise accept everything (legacy behavior)
      var filter = context.infos.checkFilter || function(obj) { return true; };
      var filterCount = context.countFilter(filter);

      var solved = true;

      // 1. Check if there are valid items left on the grid (Failure if yes)
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            // We look for items that are withdrawable AND match the criteria
            var remainingTargets = context.getItemsOn(row, col, function(obj) { 
               return obj.isWithdrawable === true && filter(obj); 
            });
            if(remainingTargets.length > 0) {
               solved = false;
            }
         }
      }
      
      // 2. Check if the robot picked up something it shouldn't have
      for(var i = 0; i < context.bag.length; i++) {
         var item = context.bag[i];
         if(!filter(item)) {
            context.success = false;
            throw(window.languageStrings.messages.failureUnfilteredObject); 
         }
      }

      if(solved) {
         context.success = true;
         throw(filterCount <= 1 && window.languageStrings.messages.successPickedAllWithdrawablesSingular
             ? window.languageStrings.messages.successPickedAllWithdrawablesSingular
             : window.languageStrings.messages.successPickedAllWithdrawables);
      }
      if(lastTurn) {
         context.success = false;
         throw(filterCount <= 1 && window.languageStrings.messages.failurePickedAllWithdrawablesSingular
             ? window.languageStrings.messages.failurePickedAllWithdrawablesSingular
             : window.languageStrings.messages.failurePickedAllWithdrawables);
      }
   },
   checkBothReachAndCollect: function(context, lastTurn) {
      var filterCount = context.countFilter(function(obj) { return obj.isWithdrawable === true; });
      var filterExitCount = context.countFilter(function(obj) { return obj.isExit === true; });
      if(0 === filterExitCount || context.isOn(function(obj) { return obj.isExit === true; })) {
         var solved = true;
         for(var row = 0;row < context.nbRows;row++) {
            for(var col = 0;col < context.nbCols;col++) {
               if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true; })) {
                  solved = false;
                  throw(filterCount <= 1 && window.languageStrings.messages.failurePickedAllWithdrawablesSingular
                     ? window.languageStrings.messages.failurePickedAllWithdrawablesSingular
                     : window.languageStrings.messages.failurePickedAllWithdrawables);
               }
            }
         }
         
         if(solved) {
            context.success = true;
            throw(filterCount <= 1 && window.languageStrings.messages.successPickedAllWithdrawablesSingular
                ? window.languageStrings.messages.successPickedAllWithdrawablesSingular
                : window.languageStrings.messages.successPickedAllWithdrawables);
         }
      }
      if(lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failureReachExit);
      }
   },
   checkLights: function(context, lastTurn) {
      var solved = true;
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            if(context.hasOn(row, col, function(obj) { return obj.isLight === true && obj.state === 0; })) {
               solved = false;
            }
         }
      }
      
      if(solved) {
         context.success = true;
         throw(window.languageStrings.messages.successLights);
      }
      if(lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failureLights);
      }
   }
};


var robotEndFunctionGenerator = {
   allFilteredPicked: function(filter) {
      return function(context, lastTurn) {
         var solved = true;
         for(var row = 0;row < context.nbRows;row++) {
            for(var col = 0;col < context.nbCols;col++) {
               var filtered = context.getItemsOn(row, col, function(obj) { return obj.isWithdrawable && filter(obj); })
               if(filtered.length != 0) {
                  solved = false;
               }
            }
         }

         for(var item in context.bag) {
            if(!filter(context.bag[item])) {
               context.success = false;
               throw(window.languageStrings.messages.failureUnfilteredObject);
            }
         }

         var filterCount = context.countFilter(filter);

         if(solved) {
            context.success = true;
            throw(filterCount <= 1 && window.languageStrings.messages.successPickedAllWithdrawablesSingular
                ? window.languageStrings.messages.successPickedAllWithdrawablesSingular
                : window.languageStrings.messages.successPickedAllWithdrawables);
         }
         if(lastTurn) {
            context.success = false;
            throw(filterCount <= 1 && window.languageStrings.messages.failurePickedAllWithdrawablesSingular
               ? window.languageStrings.messages.failurePickedAllWithdrawablesSingular
                : window.languageStrings.messages.failurePickedAllWithdrawables);
         }
      };
   },
   allNumbersWritten: function(numbers) {
      return function(context, lastTurn) {
         var solved = true;
         for(var iNumber in numbers) {
            var number = numbers[iNumber];
            var items = context.getItemsOn(number.row, number.col, function(obj) { return obj.value !== undefined; });
            if(items.length == 0)
               throw("Error: no number here");
            
            var expected;
            if(typeof number.value === "number") {
               expected = number.value;
            } else {
               expected = number.value.bind(context)();
            }
            
            if(expected != items[0].value) {
               solved = false;
            }
         }
         
         if(solved) {
            context.success = true;
            throw(window.languageStrings.messages.successNumbersWritten);
         }
         
         if(lastTurn) {
            context.success = false;
            throw(window.languageStrings.messages.failureNumbersWritten);
         }
      };
   }
};

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('robot', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['robot', getContext]);
}
