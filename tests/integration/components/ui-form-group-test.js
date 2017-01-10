import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | ui form group', function() {
    const LABEL = '[test-id="txtLabel"]';
    const DESCRIPTION = '[test-id="txtDescription"]';

    setupComponentTest('ui-form-group', {
        integration: true
    });

    beforeEach(function() {
        this.set('label', 'Test');
    });

    it('renders base component', function() {
        this.render(hbs`{{ui-form-group label=label update=(action (mut value))}}`);
        let message = 'Renders with default class';
        expect(this.$('.form-group'), message).to.have.lengthOf(1);
    });

    describe('label', function() {
        it('renders label and triggers error when not present', function(done) {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value))}}`);

            let labelSelector = this.$(LABEL);
            let message = 'Renders label attribute when one is provided';
            expect(labelSelector, message).to.have.lengthOf(1);

            try {
                this.set('label', null);
            } catch(error) {
                message = 'Triggers error when label is null';
                expect(error.name, message).to.eq('Error');
                done();
            }
        });

        it('renders correct value in label', function() {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value))}}`);

            let labelSelector = this.$(LABEL).text().trim();
            let message = `Renders with label value of "Test"`;
            expect(labelSelector, message).to.eq('Test');
        });

        it('ties the label to the input', function() {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value))}}`);

            let labelFor = this.$(LABEL).attr('for');
            let message = 'Renders for attribute on label element';
            expect(labelFor, message).to.match(/^ember(\d{1,10})-input/);

            let inputId = this.$('input').attr('id');
            message = 'Renders id attribute on form input';
            expect(inputId, message).to.match(/^ember(\d{1,10})-input/);

            message = 'Label for attribute and input id match';
            expect(inputId, message).to.eq(labelFor);
        });

        it('properly toggles visiblity of label', function() {
            this.set('labelVisible', false);
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) labelVisible=labelVisible}}`);

            let labelSelector = this.$(LABEL);
            let message = 'Adds sr-only class to label';
            expect(labelSelector.hasClass('sr-only'), message).to.be.true;

            this.set('labelVisible', true);
            message = 'Does not add sr-only class to label';
            expect(labelSelector.hasClass('sr-only'), message).to.be.false;
        });

        it('properly focuses input when label is clicked', function() {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value))}}`);

            let activeElement = this.$(document.activeElement).get(0);
            let message = 'Focuses on body by default';
            expect(activeElement.tagName, message).to.eq('BODY');

            this.$(LABEL).click();

            activeElement = this.$(document.activeElement).get(0);
            message = 'Focuses on input when label is clicked';
            expect(activeElement.tagName, message).to.eq('INPUT');

        });
    });

    describe('input', function() {
        it('renders form input', function() {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) value=value}}`);

            let inputSelector = this.$('input');
            let message = 'Renders for attribute on label element';
            expect(inputSelector, message).to.have.lengthOf(1);
        });

        it('triggers an error if the update attribute is null', function(done) {
            this.set('update', true);
            this.render(hbs`{{ui-form-group label=label update=update value=value}}`);

            try {
                this.set('update', null);
            } catch(error) {
                let message = 'Triggers error when update is null';
                expect(error.name, message).to.eq('Error');
                done();
            }
        });

        it('triggers the update action on input', function() {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) value=value}}`);

            let inputSelector = this.$('input');
            inputSelector.val('Boom').trigger('input');
            let message = 'Triggers update action on input';
            expect(this.get('value'), message).to.eq('Boom');
        });

        it('triggers the update action on change', function() {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) value=value}}`);

            let inputSelector = this.$('input');
            inputSelector.val('Boom').trigger('change');
            let message = 'Triggers update action on change';
            expect(this.get('value'), message).to.eq('Boom');
        });

        it('sets a custom input type', function() {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) inputType='search'}}`);

            let inputSelector = this.$('input');
            let message = 'Sets a custom input type';
            expect(inputSelector.attr('type'), message).to.eq('search');
        });
    });

    describe('description', function() {
        it('renders description', function() {
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) description=description}}`);

            let descriptionSelector = this.$(DESCRIPTION);
            let message = 'Does not render description when one is not provided';
            expect(descriptionSelector, message).to.have.lengthOf(0);

            this.set('description', 'Test');

            descriptionSelector = this.$(DESCRIPTION);
            message = 'Renders description attribute when one is provided';
            expect(descriptionSelector, message).to.have.lengthOf(1);
        });

        it('renders correct value in description', function() {
            let descriptionValue = 'Test';
            this.set('description', descriptionValue);
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) description=description}}`);

            let descriptionSelector = this.$(DESCRIPTION).text().trim();
            let message = `Renders with value of "${descriptionValue}"`;
            expect(descriptionSelector, message).to.eq(descriptionValue);
        });

        it('ties the description to the input', function() {
            this.set('description', 'Test');
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) description=description}}`);

            let descriptionId = this.$(DESCRIPTION).attr('id');
            let message = 'Renders id attribute on description element';
            expect(descriptionId, message).to.match(/^ember(\d{1,10})-description/);

            let inputDescribedBy = this.$('input').attr('aria-describedby');
            message = 'Renders describedby on input';
            expect(inputDescribedBy, message).to.match(/^ember(\d{1,10})-description/);

            message = 'Description id and input describedby attribute match';
            expect(inputDescribedBy, message).to.eq(descriptionId);
        });

        it('properly toggles visiblity of description', function() {
            this.set('description', 'Test');
            this.set('descriptionVisible', false);
            this.render(hbs`{{ui-form-group label=label update=(action (mut value)) description=description descriptionVisible=descriptionVisible}}`);

            let descriptionSelector = this.$(DESCRIPTION);
            let message = 'Adds sr-only class to description';
            expect(descriptionSelector.hasClass('sr-only'), message).to.be.true;

            this.set('descriptionVisible', true);
            message = 'Does not add sr-only class to description';
            expect(descriptionSelector.hasClass('sr-only'), message).to.be.false;
        });
    });
});
