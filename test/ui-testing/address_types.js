/* eslint-disable no-console */
/* global it describe Nightmare before after */
module.exports.test = function foo(uiTestCtx) {
  describe('Module test: users:address_types', function meh() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));
    let userid = null;
    const wait = 1111;

    describe('Login > Add new address type > Assign to user > Try to delete address type > Unassign from user > Try to delete again > Logout\n', () => {
      const gid = `temp_${Math.floor(Math.random() * 10000)}`;
      const gidlabel = 'Temporary';
      const deletePath = `div[title="${gid}"] ~ div:last-of-type button[id*="delete"]`;
      before((done) => {
        login(nightmare, config, done); // logs in with the default admin credentials
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open app and find version tag', (done) => {
        nightmare
          .use(openApp(nightmare, config, done, 'users', testVersion))
          .then(result => result);
      });
      it(`should create an address type for "${gidlabel}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/users"]')
          .wait(wait)
          .click('a[href="/settings/users"]')
          .wait('a[href="/settings/users/addresstypes"]')
          .wait(wait)
          .click('a[href="/settings/users/addresstypes"]')
          .wait(wait)
          .click('#clickable-add-addresstypes')
          .wait(1000)
          .type('input[name="items[0].addressType"]', gid)
          .type('input[name="items[0].desc"]', gidlabel)
          .wait(1000)
          .click('#clickable-save-addresstypes-0')
          .wait(wait)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .then(() => { done(); })
          .catch(done);
      });
      it('should find an active user to edit', (done) => {
        nightmare
          .click('#clickable-users-module')
          .wait(1000)
          .click('#clickable-filter-active-Active')
          .wait('#list-users div[role="listitem"]:nth-of-type(11) > a > div:nth-of-type(5)')
          .evaluate(() => document.querySelector('#list-users div[role="listitem"]:nth-of-type(11) > a > div:nth-of-type(5)').title)
          .then((result) => {
            userid = result;
            done();
            console.log(`        (found user ID ${userid})`);
          })
          .catch(done);
      });
      it(`should edit user record using "${gid}" addresstype`, (done) => {
        nightmare
          .type('#input-user-search', userid)
          .wait(`div[title="${userid}"]`)
          .click(`div[title="${userid}"]`)
          .wait('#clickable-edituser')
          .click('#clickable-edituser')
          .wait('select[name="personal.addresses[0].addressType"]')
          .select('select[name="personal.addresses[0].addressType"]', gid)
          .wait(1000)
          .click('#clickable-updateuser')
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .then(() => { done(); })
          .catch(done);
      });
      /* it('should find ID for "Staff" group', (done) => {
        nightmare
          .click('#clickable-users-module')
          .wait(`input[id*="${gid}"]`)
          .click(`input[id*="${gid}"]`)
          .wait(`div[title="${userid}"]`)
          .click(`div[title="${userid}"]`)
          .wait('#clickable-edituser')
          .click('#clickable-edituser')
          .wait('#adduser_group')
          .xtract('id("adduser_group")/option[contains(.,"Staff")]/@value')
          .then((result) => {
            staffid = result;
            done();
            console.log(`        (found "Staff" group ID ${staffid})`);
          })
          .catch(done);
      }); */
      /* it('should change patron group to "Staff" in user record', (done) => {
        nightmare
          .select('#adduser_group', staffid)
          .type('#adduser_externalsystemid', false)
          .type('#adduser_externalsystemid', 'testId')
          .wait(1000)
          .click('#clickable-updateuser')
          .wait(() => {
            if (!document.getElementById('clickable-updateuser')) {
              return true;
            }
            return false;
          })
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .then(() => { done(); })
          .catch(done);
      });
      it(`should delete "${gid}" patron group`, (done) => {
        nightmare
          .wait(1111)
          .click(config.select.settings)
          .wait('a[href="/settings/users"]')
          .wait(wait)
          .xclick('id("ModuleContainer")//a[.="Users"]')
          .wait(wait)
          .xclick('id("ModuleContainer")//a[.="Patron groups"]')
          .wait((dp) => {
            const dnode = document.querySelector(dp);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, deletePath)
          .click(deletePath)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .click('#clickable-deletepatrongroup-confirmation-confirm')
          .wait(wait)
          .then(() => { done(); })
          .catch(done);
      });
      it(`should confirm that "${gid}" patron group has been deleted`, (done) => {
        nightmare
          .wait(wait)
          .evaluate((egid) => {
            const cnode = document.evaluate(`//div[.="${egid}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (cnode.singleNodeValue) {
              throw new Error(`${egid} patron group found after clicking "Delete" button!`);
            }
          }, gid)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .then(() => { done(); })
          .catch(done);
      }); */
    });
  });
};
