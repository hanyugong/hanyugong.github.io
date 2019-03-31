console.clear();
var elApp = document.querySelector("#app");
var elButton = document.querySelector(".ui-submit");
var elPassword = document.querySelector(".ui-password-input");
var elReset = document.querySelector(".ui-reset");

var context = {
  password: "" };


var actions = {
  updatePassword: xstate.actions.assign({
    password: function password(_, event) {return event.value;} }),

  validatePassword: function validatePassword(ctx) {
    setTimeout(function () {
      if (ctx.password === "hanyu0226") {
//        send("VALID");
          window.location.href='lifemate-protected.html';
      } else {
        send("INVALID");
      }
    }, 2000);
  },
  reset: function reset() {
    elPassword.value = "";
  },
  clearPassword: function clearPassword() {
    elPassword.value = "";
    return { password: "" };
  } };


var passwordMachine = xstate.Machine(
{
  initial: "idle",
  context: context,
  states: {
    idle: {
      onEntry: "clearPassword",
      on: {
        SUBMIT: [{ target: "validating", cond: "passwordEntered" }],
        CHANGE: {
          target: "idle",
          actions: "updatePassword",
          internal: true // this prevents onEntry from running again
        } } },


    validating: {
      onEntry: "validatePassword",
      on: {
        VALID: "success",
        INVALID: "error" } },


    error: {
      after: {
        2000: "idle" } },


    success: {} },

  on: {
    RESET: ".idle" } },


{
  actions: actions,
  guards: {
    passwordEntered: function passwordEntered(ctx) {return ctx.password && ctx.password.length;} } });




var state = passwordMachine.initialState;

function activate(state) {
  elApp.dataset.state = state.value;

  document.querySelectorAll("[data-active]").forEach(function (el) {
    el.removeAttribute("data-active");
  });

  document.querySelectorAll("[data-show~=\"" + state.value + "\"]").forEach(function (el) {
    el.setAttribute("data-active", true);
  });
}

var interpreter = xstateInterpreter.
interpret(passwordMachine).
onTransition(activate).
start();

activate(state);var

send = interpreter.send;

elButton.addEventListener("click", function () {return send("SUBMIT");});
elPassword.addEventListener("input", function (e) {return (
    send({ type: "CHANGE", value: e.target.value }));});

elApp.addEventListener("submit", function (e) {
  e.preventDefault();
  send("SUBMIT");
});
elReset.addEventListener("click", function () {return send("RESET");});