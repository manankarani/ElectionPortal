/****************************
 REQUEST PARAM SET CONTROLLER
 ****************************/
class Controller {
  boot(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    return this;
  }
}

module.exports = Controller;
