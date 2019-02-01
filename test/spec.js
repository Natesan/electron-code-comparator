const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const electronPath = require('electron');

describe('Application Launch', function() {
    this.timeout(10000);

    before(function(){
        chai.should();
        chai.use(chaiAsPromised);
    });

    beforeEach(function(){
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')]
        })
        return this.app.start();
    });

    afterEach(function(){
        if(this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('tests the title', function() {
        return this.app.client.waitUntilWindowLoaded().getTitle().should.eventually.equal('Code Comparator');
    });

    it('should have a source folder selector', function() {
        return this.app.client
        .element('#source-folder').getValue().should.eventually.equal('Choose a source folder');
    });

    it('should have a destination folder selector', function() {
        return this.app.client
        .element('#destination-folder').getValue().should.eventually.equal('Choose a destination folder');
    });

    it('should have compare action', function() {
        return this.app.client
        .element('#compare-button').getText().should.eventually.equal('Compare');
    });

    it('should perform null checks for source and destination folder selectors', function() {
        return this.app.client
            .element('#compare-button').click()
            .element('#alertText').getText().should.eventually.equal('Please select both the directories.');
    });
    
})