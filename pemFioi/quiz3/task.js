(function () {

    window.lang = {

        default_language: 'en',
        language: 'en',
        language_set: false,
        sublanguage: null,

        strings: {
            en: {
                'score': 'Score',
                'grader_msg': 'Your score is ',
                'wrong_answer_msg': 'You have at least one mistake.',
                'wrong_answer_msg_partial_feedback': 'You have at least one mistake. Here is a hint:',
                'wrong_answer_msg_not_answered': 'You didn\'t answer this question',
                'wrong_fill_gaps_msg': 'You have %% incorrect answers for this question, highlighted in red.',
                'wrong_partial': 'You didn\'t answer this question completely.',
                'validate': 'Submit',
                'solution': 'Show answer',
                'restart': 'Restart',
                'restart_scratch': 'Restart from scratch',
                'restart_current': 'Restart from current answer',
                'return_to_top': 'Return to the list of questions',
                'move_to_next': 'Next question',
                'placeholder_text': 'Enter text',
                'placeholder_number': 'Enter number',
                'error_number': 'Must be a number',
                'placeholder_string': 'Enter string',
                'error_string': 'Must be a string',
                'placeholder_regexp': 'Enter text',
                'error_regexp': 'Invalid format',
                'error_grading': 'There was an error while submitting this answer, please try again in a few minutes.',
                'feedback_score_binary_correct': 'Congratulations, everything is correct.',
                'feedback_score_binary_mistake': 'There is at least one mistake.',
                'feedback_answer_saved': 'Your answer has been saved.',
                'prompt_single': 'Select one answer',
                'prompt_multiple': 'Select 0 to %% answers'
            },
            fr: {
                'score': 'Score',
                'grader_msg': 'Votre score est ',
                'wrong_answer_msg': 'Vous avez au moins une erreur.',
                'wrong_answer_msg_partial_feedback': 'Vous avez au moins une erreur. Voici un indice :',
                'wrong_answer_msg_not_answered': "Vous n'avez pas répondu à cette question.",
                'wrong_fill_gaps_msg': 'Vous avez %% réponses incorrectes pour cette question, surlignées en rouge.',
                'wrong_partial': "Vous n'avez pas répondu entièrement à cette question.",
                'validate': 'Valider',
                'solution': 'Voir la réponse',
                'restart': 'Recommencer',
                'restart_scratch': 'Recommencer au début',
                'restart_current': 'Modifier ma réponse',
                'return_to_top': 'Retour à la liste des questions',
                'move_to_next': 'Question suivante',
                'cancel': 'Annuler',
                'placeholder_text': 'Entrez du texte',
                'placeholder_number': 'Entrez un nombre',
                'error_number': 'Vous devez entrer un nombre.',
                'placeholder_string': 'Entrez une chaîne de caractères',
                'error_string': 'Vous devez entrer une chaïne de caractères',
                'placeholder_regexp': 'Entrez du texte.',
                'error_regexp': 'Format invalide',
                'error_grading': 'Erreur lors de la soumission, veuillez réessayer dans quelques minutes.',
                'feedback_score_binary_correct': 'Félicitations, tout est correct.',
                'feedback_score_binary_mistake': 'Il y a au moins une erreur.',
                'feedback_answer_saved': 'Votre réponse a été enregistrée.',
                'prompt_single': 'Sélectionnez une réponse',
                'prompt_multiple': 'Sélectionnez de 0 à %% réponses',
            },
            de: {
                'score': 'Punktzahl',
                'grader_msg': 'Deine Punktzahl ist: ',
                'wrong_answer_msg': 'Du hast mindestens einen Fehler.',
                'wrong_answer_msg_partial_feedback': 'Du hast mindestens einen Fehler. Hier ist ein Hinweis: ',
                'wrong_answer_msg_not_answered': "Du hast die Frage nicht beantwortet.",
                'wrong_fill_gaps_msg': 'Du hast %% falsche Antworten bei dieser Frage, die rot markiert sind.',
                'wrong_partial': "Du hast eine Frage nicht komplett beantwortet.",
                'validate': 'Überprüfen',
                'solution': 'Antwort anzeigen',
                'restart': 'Neu starten',
                'restart_scratch': 'Von vorne beginnen',
                'restart_current': 'Meine Antwort bearbeiten',
                'return_to_top': 'Zurück zur Fragenliste',
                'move_to_next': 'Nächste Frage',
                'cancel': 'Abbrechen',
                'placeholder_text': 'Text eingeben',
                'placeholder_number': 'Zahl eingeben',
                'error_number': 'Du musste eine Zahl eingeben.',
                'placeholder_string': 'Gibt eine Zeichenfolge ein.',
                'error_string': 'Du must eine Zeichenfolge eingeben.',
                'placeholder_regexp': 'Gib einen text ein.',
                'error_regexp': 'Ungültiges Format',
                'error_grading': 'Fehler beim Absenden, bitte versuche es in einigen Minuten erneut.',
                'feedback_score_binary_correct': 'Herzlichen Glückwunsch, alles ist korrekt.',
                'feedback_score_binary_mistake': 'Es gibt mindestens einen Fehler.',
                'feedback_answer_saved': 'Deine Antwort wurde gespeichert.',
                'prompt_single': 'Wähle eine Antwort aus',
                'prompt_multiple': 'Wähle 0 bis %% Antworten aus',
            },

        },

        substrings: {
            hint: {
                en: {
                    'solution': 'Show hint'
                },
                fr: {
                    'solution': 'Afficher un indice'
                },
                de: {
                    'solution': 'Gib einen Hinweis'
                }
            }
        },

        set: function (lng) {
            if (!lng) {
                lng = window.stringsLanguage;
            }
            this.language = lng;
            this.language_set = true;
        },

        setSublanguage: function (sublng) {
            this.sublanguage = sublng;
        },

        translate: function () {
            if (!this.language_set) {
                this.set();
            }
            var str = '', key = arguments[0];
            if (this.sublanguage && this.substrings[this.sublanguage] && this.substrings[this.sublanguage][this.language]) {
                str = this.substrings[this.sublanguage][this.language][key];
            }
            if (!str && this.strings[this.language]) {
                str = this.strings[this.language][key];
            }
            if (!str) {
                str = this.strings[this.default_language][key] || key;
            }
            return str.replace('%%', arguments[1]);
        }
    }


    var task_toolbar = {

        buttons: {},
        holder: false,
        popup: false,
        validated: false,
        displayFeedbackOnNextGrade: false,

        addButton: function (parent, name, callback) {
            var btn = $('<button class="btn btn-success">' + lang.translate(name) + '</button>');
            btn.on('click', callback);
            parent.append(btn);
            this.buttons[name] = btn;
        },


        restartTask: function (from_scratch) {
            this.displayFeedbackOnNextGrade = false;
            this.setValidated(false);
            this.popup.hide();
            this.unfreezeTask();
            this.clearFeedback();
            window.quiz_ui.toggleFeedback(false);
            task.showViews({ "task": true, "solution": false }, function () { });
            window.quiz_ui.reset(from_scratch);
        },

        showPopup: function () {
            if (!this.popup) {
                this.popup = $(
                    '<div class="quiz-popup-inner"><div class="content"></div></div>\
                    <div class="quiz-popup">\
                        <div class="opacity-overlay"></div>\
                    </div>'
                );
                $(document.body).append(this.popup);
                var el = this.popup.find('.content');
                var self = this;
                this.addButton(el, 'restart_scratch', function () {
                    self.restartTask(true);
                });
                this.addButton(el, 'restart_current', function () {
                    self.restartTask();
                });
                this.addButton(el, 'cancel', function () {
                    self.popup.hide();
                });
            }
            $('.quiz-popup-inner').css('top', (Math.max(0, $('.quiz-toolbar').offset().top - 140)) + 'px')
            this.popup.show();
        },


        freezeTask: function () {
            if (!this.freezer) {
                this.freezer = $('<div class="freeze-overlay"></div>')
                $('.taskContent').append(this.freezer);
            }
            this.freezer.show();
        },


        unfreezeTask: function () {
            this.freezer && this.freezer.hide();
        },


        clearFeedback: function () {
            $('.error-message, .success-message, .feedback-message').remove();
        },


        setValidated: function (validated) {
            this.validated = !!validated;
            if (validated) {
                this.buttons.validate.hide();
                this.buttons.move_to_next && this.buttons.move_to_next.show();
                this.buttons.solution && this.buttons.solution.show();
            } else {
                this.buttons.validate.show();
                this.buttons.move_to_next && this.buttons.move_to_next.hide();
                this.buttons.solution && this.buttons.solution.hide();
            }
        },


        displayError: function (error) {
            if (!this.errorHolder) {
                this.errorHolder = $('<div class="error-message"></div>');
                this.holder.append('<br>');
                this.holder.append(this.errorHolder);
            }
            this.errorHolder.html('<i class="fas fa-bell icon"></i> ' + error);
            this.errorHolder.toggle(!!error);
        },


        init: function () {
            if (this.holder) return;
            $('#showSolutionButton').remove();
            $('.quiz-toolbar').remove();
            if (quiz_settings.sublanguage) {
                lang.setSublanguage(quiz_settings.sublanguage);
            }
            this.holder = $('<div class="quiz-toolbar"></div>');
            var self = this;
            this.addButton(this.holder, 'validate', function () {
                self.freezeTask();
                self.setValidated(true);
                self.displayFeedbackOnNextGrade = true;
                self.clearFeedback();
                var cb = null;
                if (Quiz.params.feedback_score == 'saved') {
                    cb = function () {
                        displayScore();
                    }
                }
                platform.validate('done', cb);
            });
            var hasSolution = false;
            $('solution, .solution, #solution').each(function () {
                if ($(this).text().trim() != '') { hasSolution = true; }
            });
            if (hasSolution && window.miniPlatformShowSolution) {
                this.addButton(this.holder, 'solution', function () {
                    miniPlatformShowSolution();
                });
                this.buttons.solution.hide();
            }
            if (!quiz_settings.hide_restart) {
                this.addButton(this.holder, 'restart', function () {
                    self.showPopup();
                });
            }
            if (quiz_settings.display_move_to_next) {
                this.addButton(this.holder, 'move_to_next', function () {
                    platform.validate('next');
                });
                this.buttons.move_to_next.hide();
            }
            if (quiz_settings.display_return_to_top) {
                this.holder.append('<br><br>');
                this.addButton(this.holder, 'return_to_top', function () {
                    platform.validate('top');
                });
            }
            this.holder.insertAfter($('.taskContent'));
        }

    }


    var task_token = {

        token: null,

        init: function () {
            var query = document.location.search.replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
            this.token = this.token || query.sToken;
        },

        get: function () {
            return this.token
        },

        update: function (token) {
            this.token = token
        },

        getAnswerToken: function (answer) {
            return null;
        }
    }



    window.task = {}

    task.getViews = function (success, error) {
        var views = {
            task: {}
        };
        success(views);
    };

    task.updateToken = function (token, success, error) {
        task_token.update(token)
        success();
    };

    task.getHeight = function (success, error) {
        var d = document;
        var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
        success(h);
    };

    task.getMetaData = function (success, error) {
        var metadata = {
            disablePlatformProgress: true,
            minWidth: 'auto',
            nbHints: 0,
            usesTokens: true,
            autoHeight: true
        };
        if (typeof json !== 'undefined') {
            Object.assign(metadata, json);
        }
        success(metadata);
    };

    task.reloadState = function (state, success, error) { success() }
    task.getState = function (success, error) { success("{}") }
    task.reloadStateObject = function (obj) { }
    task.getStateObject = function () { return {} }
    task.getDefaultStateObject = function () { return {} }


    function displayScore(score, max_score) {
        if (Quiz.params.feedback_score == 'binary') {
            var msg = '<span class="scoreLabel">';
            if (score == max_score) {
                msg += lang.translate('feedback_score_binary_correct');
            } else {
                msg += lang.translate('feedback_score_binary_mistake');
            }
            msg += '</span>';
        } else if (Quiz.params.feedback_score == 'exact') {
            var msg =
                '<span class="scoreLabel">' + lang.translate('score') + '</span>' +
                '<span class="value">' + score + '</span>' +
                '<span class="max-value">/' + max_score + '</span>';
        } else if (Quiz.params.feedback_score == 'saved') {
            var msg = '<span class="scoreLabel">' + lang.translate('feedback_answer_saved') + '</span>';
        } else {
            return;
        }
        if ($('#score').length == 0) {
            var div = '<div id="score"></div>';
            $('.taskContent').first().append(div);
        }
        $('#score').html(msg);
    }


    $('.grader').hide();


    // grade

    function useGraderData(answer, versions, score_settings, callback, errorcb) {
        if (window.Quiz.grader.handler && window.Quiz.grader.data) {
            var res = window.Quiz.grader.handler(window.Quiz.grader.data, answer, versions, score_settings);
            return callback(res);
        }
        console.error('Cannot evaluate : no local grader or data.');
        if (errorcb) { errorcb(); }
    }


    function useGraderUrl(url, task_token, answer, answer_token, versions, score_settings, callback, errorcb) {
        var data = {
            action: 'grade2', //
            task: task_token,
            answer: answer,
            answer_token: answer_token,
            versions: versions,
            score_settings: score_settings
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            crossDomain: true,
            contentType: 'application/json'
        }).done(function (res) {
            if (res.success) {
                return callback(res.data);
            }
            console.error('Grader response error: ', res);
            if (errorcb) { errorcb(); }
        }).fail(function (jqxhr, settings, exception) {
            console.error('Grader url not responding: ' + url);
            if (errorcb) { errorcb(); }
        });
    }





    task.load = function (views, success) {
        var lastViews = views;
        var lastReloadedAnswer = null;
        task_token.init()

        platform.getTaskParams(null, null, function (taskParams) {
            taskParams.maxScore = 100;
            taskParams.minScore = 0;
            var params = Object.assign(quiz_settings, {
                random: parseInt(taskParams.randomSeed, 10) || Math.floor(Math.random() * 100), //0
                parent: $('#task')
            })
            var q = Quiz.UI(params);
            window.quiz_ui = q;

            task.showViews = function (views, callback) {
                lastViews = views;
                q.toggleSolutions(!!views.solution);
                callback();
            }

            task.getDefaultAnswerObject = function () {
                return {
                    data: [],
                    versions: {}
                }
            }

            task.getAnswer = function (callback) {
                var answer = this.getAnswerObject();
                answer = JSON.stringify(answer);
                //console.log('task.getAnswer', answer)
                callback(answer);
            };

            task.getAnswerObject = function () {
                var answerObj = {
                    data: q.getAnswer(),
                    submittingSingle: q.getSubmittingSingle(),
                    versions: Quiz.versions.get(),
                    validated: task_toolbar.validated
                }
                if (lastReloadedAnswer
                    && JSON.stringify(lastReloadedAnswer.data) == JSON.stringify(answerObj.data)
                    && JSON.stringify(lastReloadedAnswer.versions) == JSON.stringify(answerObj.versions)) {
                    // Keep the validated attribute if the answer didn't change
                    answerObj.validated = answerObj.validated || lastReloadedAnswer.validated;
                }
                return answerObj;
            };


            task.reloadAnswer = function (answer, callback) {
                /*
                 * Medal übergibt einen leeren String, wenn noch keine
                 * gespeicherte Antwort vorhanden ist. Das ist kein JSON und
                 * darf deshalb nicht an JSON.parse() übergeben werden.
                 */
                if (
                    typeof answer !== 'string' ||
                    answer.trim() === ''
                ) {
                    callback();
                    return;
                }

                try {
                    //console.log('task.reloadAnswer', answer)
                    var answerObject = JSON.parse(answer);

                    this.reloadAnswerObject(answerObject);

                    if (
                        lastViews.solution ||
                        (
                            quiz_settings.hide_restart &&
                            answerObject.validated
                        )
                    ) {
                        task_toolbar.setValidated(true);

                        /*
                         * Hier wird gradeAnswer() ausdrücklich aufgerufen, um
                         * bereits validiertes Feedback wiederherzustellen.
                         */
                        task_toolbar.displayFeedbackOnNextGrade = true;

                        task.gradeAnswer(
                            answer,
                            null,
                            function () { }
                        );
                    }
                } catch (e) {
                    console.error('Quiz: answer parsing error.')
                }

                callback();
            };


            task.reloadAnswerObject = function (answerObj) {
                var new_format = answerObj !== null && typeof answerObj === 'object' && 'data' in answerObj;
                q.setAnswer(new_format ? answerObj.data : answerObj);
                lastReloadedAnswer = answerObj;
            }



            function displayMessages(messages) {
                if ($('#grader-messages').length == 0) {
                    var div = '<div id="grader-messages"></div>';
                    $('.taskContent').first().append(div);
                }
                $('#grader-messages').html(messages.join('<br>'));
            }


            task.gradeAnswer = function (answer, answer_token, callback) {
                /*
                 * Auch gradeAnswer() wird von der Plattform gelegentlich mit
                 * einem leeren String aufgerufen. Dann bewerten wir den aktuell
                 * im Quiz sichtbaren Antwortzustand.
                 */
                if (typeof answer === 'string') {
                    answer = answer.trim() === ''
                        ? task.getAnswerObject()
                        : JSON.parse(answer);
                } else if (
                    !answer ||
                    typeof answer !== 'object'
                ) {
                    answer = task.getAnswerObject();
                }

                var new_format =
                    answer !== null &&
                    typeof answer === 'object' &&
                    'data' in answer;

                /*
                 * Bei submit_single enthält submittingSingle den Index der
                 * ausdrücklich überprüften Frage. Ältere Antwortobjekte können
                 * das Feld noch gar nicht enthalten.
                 */
                var isSingleSubmission =
                    new_format &&
                    answer.submittingSingle !== null &&
                    typeof answer.submittingSingle !== 'undefined';

                /*
                 * Der Wert wird für genau diesen Bewertungsvorgang festgehalten.
                 * Anschließend wird der einmalige Schalter sofort zurückgesetzt.
                 */
                var shouldDisplayFeedback =
                    task_toolbar.displayFeedbackOnNextGrade ||
                    isSingleSubmission;

                task_toolbar.displayFeedbackOnNextGrade = false;

                function onGrade(result) {
                    /*
                     * Die Punkteberechnung und der Callback finden immer statt.
                     * Dadurch kann die Plattform die Antwort weiterhin automatisch
                     * speichern.
                     */
                    if (Quiz.params.save_only_mode) {
                        result.score = taskParams.maxScore;
                    }

                    /*
                     * Sichtbares Feedback gibt es nur nach einer ausdrücklichen
                     * Prüfung – nicht beim automatischen Bewerten.
                     */
                    if (shouldDisplayFeedback) {
                        q.displayFeedback(result.feedback);

                        if (!isSingleSubmission) {
                            displayScore(
                                result.score,
                                taskParams.maxScore
                            );

                            q.displayOverallFeedback(
                                result.overall_feedback
                            );
                        }
                    }

                    //displayMessages(result.messages);
                    callback(
                        result.score,
                        lang.translate('grader_msg') + result.score,
                        result.token || null
                    );
                }
                function onError(result) {
                    task_toolbar.displayError(lang.translate('error_grading'));
                }
                var scoreSettings = {
                    maxScore: taskParams.maxScore,
                    minScore: taskParams.minScore,
                    noScore: taskParams.noScore,
                    score_calculation: 'score_calculation' in quiz_settings ? quiz_settings.score_calculation : {},
                    questions_info: q.getQuestionsInfo()
                };

                var token = task_token.get()
                if (token && !window.Quiz.grader.data) {
                    useGraderUrl(
                        quiz_settings.graderUrl,
                        token,
                        new_format ? answer.data : answer,
                        answer_token,
                        new_format ? answer.versions : Quiz.versions.get(),
                        scoreSettings,
                        onGrade,
                        onError
                    );
                } else {
                    useGraderData(
                        new_format ? answer.data : answer,
                        new_format ? answer.versions : Quiz.versions.get(),
                        scoreSettings,
                        onGrade,
                        onError
                    );
                }
            };

            success();
        });
    };

    var grader = {
        gradeTask: task.gradeAnswer
    };

    $(function () {
        if (!window.quiz_settings) { window.quiz_settings = {}; }
        if (window.platform) {
            platform.initWithTask(task);
            task_toolbar.init();
        }
    })

    window.taskGetResourcesPost = function (res, callback) {
        // Add grader_data, if available, to the javascript
        try {
            $.get('grader_data.js').success(function (data) {
                res.task.push({ type: 'javascript', id: 'grader_data', content: data });
                callback(res);
            }).error(function () {
                callback(res);
            });
        } catch (e) {
            callback(res);
        }
    };
})();
