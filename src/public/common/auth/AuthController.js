define([
    "skylark/spa",
    "skylark/langx",
    "jquery",
    "modernizr",
    "toastr",
    "text!common/auth/auth.html"
], function(spa, langx, $, modernizr, toastr, authTpl) {
    var AuthController = langx.Evented.inherit({
        klassName: "AuthController",
        init: function(e) {
            this.dom = $("<div>").html(authTpl);
            this.buildDom(this.dom);
        },

        getNode: function() {
            return $(this.dom.children()[0]);
        },

        show: function() {
            $(".auth-page").addClass("is-visible");
            ["signin-email", "signin-password", "signup-username", "signup-password", "signup-email"].forEach(function(name) {
                $("#" + name).val("");
            });
        },

        hide: function() {
            $(".auth-page").removeClass("is-visible");
        },
        buildDom: function(dom) {
            var self = this;
            //credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
            $.fn.putCursorAtEnd = function() {
                return this.each(function() {
                    // If this function exists...
                    if (this.setSelectionRange) {
                        // ... then use it (Doesn't work in IE)
                        // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
                        var len = $(this).val().length * 2;
                        this.setSelectionRange(len, len);
                    } else {
                        // ... otherwise replace the contents with itself
                        // (Doesn't work in Google Chrome)
                        $(this).val($(this).val());
                    }
                });
            };
            var $form_modal = dom.find('.cd-user-modal'),
                $form_login = $form_modal.find('#cd-login'),
                $form_signup = $form_modal.find('#cd-signup'),
                $form_forgot_password = $form_modal.find('#cd-reset-password'),
                $form_modal_tab = dom.find('.cd-switcher'),
                $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
                $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
                $forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
                $back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a');

            login_selected();

            //close modal
            dom.find('.cd-user-modal').on('click', function(event) {
                if ($(event.target).is($form_modal) || $(event.target).is('.cd-close-form')) {
                    self.hide();
                }
            });
            //close modal when clicking the esc keyboard button
            $(document).keyup(function(event) {
                if (event.which == '27') {
                    self.hide();
                }
            });

            //switch from a tab to another
            $form_modal_tab.on('click', function(event) {
                event.preventDefault();
                ($(event.target).is($tab_login)) ? login_selected(): signup_selected();
            });

            //hide or show password
            dom.find('.hide-password').on('click', function() {
                var $this = $(this),
                    $password_field = $this.prev('input');

                ('password' == $password_field.attr('type')) ? $password_field.attr('type', 'text'): $password_field.attr('type', 'password');
                ('隐藏' == $this.text()) ? $this.text('显示'): $this.text('隐藏');
                //focus and move cursor to the end of input field
                $password_field.putCursorAtEnd();
            });

            //show forgot-password form
            $forgot_password_link.on('click', function(event) {
                event.preventDefault();
                forgot_password_selected();
            });

            //back to login from the forgot-password form
            $back_to_login_link.on('click', function(event) {
                event.preventDefault();
                login_selected();
            });

            function login_selected() {
                $form_login.addClass('is-selected');
                $form_signup.removeClass('is-selected');
                $form_forgot_password.removeClass('is-selected');
                $tab_login.addClass('selected');
                $tab_signup.removeClass('selected');
            }

            function signup_selected() {
                $form_login.removeClass('is-selected');
                $form_signup.addClass('is-selected');
                $form_forgot_password.removeClass('is-selected');
                $tab_login.removeClass('selected');
                $tab_signup.addClass('selected');
            }

            function forgot_password_selected() {
                $form_login.removeClass('is-selected');
                $form_signup.removeClass('is-selected');
                $form_forgot_password.addClass('is-selected');
            }

            function checkVal(name, value) {
                var validates = {
                    username: {
                        emptyMsg: "用户名不能为空",
                        numsMsg: "用户名不能少于6位",
                        numlMsg: "用户名不能多于14位",
                        snMsg: "用户名必须以字母开头",
                        validateMsg: "用户名不能包含字符",
                        check: function(value) {
                            var _us = $("#signup-username");
                            if (value) {
                                if (value.length < 6) {
                                    _us.focus();
                                    return { error: true, msg: this.numsMsg };
                                }
                                if (value.length > 14) {
                                    _us.focus();
                                    return { error: true, msg: this.numlMsg };
                                }
                                if (!value.match(/^[a-zA-Z0-9]+$/)) {
                                    _us.focus();
                                    return { error: true, msg: this.validateMsg };
                                }
                                if (value.match(/^[^a-zA-Z]/)) {
                                    _us.focus();
                                    return { error: true, msg: this.snMsg };
                                }
                            } else {
                                _us.focus();
                                return { error: true, msg: this.emptyMsg };
                            }
                        }
                    },
                    display: {
                        emptyMsg: "真实姓名不能为空",
                        lsMsg: "真实姓名不能小于2位",
                        llMsg: "密码不能多于8位",
                        validateMsg: "当前真实姓名不可用（真实姓名长度为2~8位）",
                        check: function(value) {
                            var _ds = $("#signup-display");
                            if (value) {
                                if (value.length < 2) {
                                    _ds.focus();
                                    return { error: true, msg: this.lsMsg };
                                }
                                if (value.length > 4) {
                                    _ds.focus();
                                    return { error: true, msg: this.llMsg };
                                }
                            } else {
                                _ds.focus();
                                return { error: true, msg: this.emptyMsg };
                            }
                        }
                    },
                    password: {
                        emptyMsg: "密码不能为空",
                        numMsg: "必须包含数字",
                        lwordMsg: "必须包含消息字母",
                        lsMsg: "密码不能少于8位",
                        llMsg: "密码不能多于16位",
                        uwordMsg: "必须包含大写字母",
                        usernameEqMsg: "不能设置与用户名一样的密码",
                        validateMsg: "当前密码不可用（密码长度为8-16，必须包含大小写字母和数字）",
                        check: function(value) {
                            var re, _ps = $("#signup-password");
                            if (value) {
                                if (value == $("#signup-username").val()) {
                                    _ps.focus();
                                    return { error: true, msg: this.usernameEqMsg };
                                }
                                re = /[0-9]/;
                                if (!re.test(value)) {
                                    _ps.focus();
                                    return { error: true, msg: this.numMsg };
                                }
                                re = /[a-z]/;
                                if (!re.test(value)) {
                                    _ps.focus();
                                    return { error: true, msg: this.lwordMsg };
                                }
                                re = /[A-Z]/;
                                if (!re.test(value)) {
                                    _ps.focus();
                                    return { error: true, msg: this.uwordMsg };
                                }
                                if (value.length < 8) {
                                    _ps.focus();
                                    return { error: true, msg: this.lsMsg };
                                }
                                if (value.length > 16) {
                                    _ps.focus();
                                    return { error: true, msg: this.llMsg };
                                }
                            } else {
                                _ps.focus();
                                return { error: true, msg: this.emptyMsg };
                            }
                        }
                    },
                    email: {
                        emptyMsg: "邮箱不能为空",
                        validateMsg: "当前邮箱不可用（样板xxx@qq.com）",
                        check: function(value) {
                            var _es = $("#signup-email");
                            if (value) {
                                if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                                    _es.focus();
                                    return { error: true, msg: this.validateMsg };
                                }
                            } else {
                                _es.focus();
                                return { error: true, msg: this.emptyMsg };
                            }
                        }
                    }
                };
                return validates[name].check(value);
            }

            function submitCheck() {
                var result;
                $form_signup.find("input").filter(function() {
                    return this.type != "submit";
                }).each(function(i, e) {
                    result = checkVal(e.name, e.value);
                    if (result && result.error) return false;
                });
                return result;
            }
            $form_signup.delegate('input', 'blur', function(e) {
                var t = e.currentTarget;
                if (t.type != "submit") {
                    var result = checkVal(t.name, t.value);
                    if (result && result.error) {
                        $(t).parent().find(".cd-error-message").text(result.msg).css({
                            opacity: 1,
                            visibility: "visible"
                        });
                        // toastr.error(result.msg);
                    }
                }
            });

            // //REMOVE THIS - it's just to show error messages
            $form_login.find('input[type="submit"]').on('click', function(event) {
                event.preventDefault();
                $.post("/login", {
                    username: $("#signin-username").val(),
                    password: $("#signin-password").val()
                }, function(data) {
                    if (data.status) {
                        window.location.assign("/party/profile");
                    } else {
                        toastr.error(data.msg);
                    }
                });
            });
            $form_signup.find('input[type="submit"]').on('click', function(event) {
                event.preventDefault();
                var result = submitCheck();
                if (result && result.error) {
                    toastr.error(result.msg);
                } else {
                    $.post("/registry", {
                        display: $("#signup-display").val(),
                        username: $("#signup-username").val(),
                        email: $("#signup-email").val(),
                        password: $("#signup-password").val()
                    }, function(data) {
                        if (data.status) {
                            login_selected();
                            $("#signin-username").val($("#signup-username").val());
                            toastr.options.closeDuration = 3000;
                            toastr.success(data.msg);
                        } else {
                            toastr.error(data.msg);
                        }
                    });

                }
                // $form_signup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
            });


            //IE9 placeholder fallback
            //credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
            if (!Modernizr.input.placeholder) {
                dom.find('[placeholder]').focus(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                }).blur(function() {
                    var input = $(this);
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                }).blur();
                dom.find('[placeholder]').parents('form').submit(function() {
                    $(this).find('[placeholder]').each(function() {
                        var input = $(this);
                        if (input.val() == input.attr('placeholder')) {
                            input.val('');
                        }
                    })
                });
            };
        }
    });

    var auth;
    var authFunc = function() {
        if (!auth) {
            auth = new AuthController();
        }
        return auth;
    }
    return authFunc;
});
