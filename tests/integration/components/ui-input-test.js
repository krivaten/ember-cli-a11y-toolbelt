import Ember from 'ember';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

const { run  } = Ember;

describe('Integration | Component | ui input', function() {
    setupComponentTest('ui-input', {
        integration: true
    });

    it('renders', function() {
    });

    it('defaults the type to "text"', function() {
        this.render(hbs`{{ui-input}}`);

        let selector = this.$('input').attr('type');
        let message = 'defaults type to "text"';
        expect(selector, message).to.eq('text');
    });

    it('allows a specific type to be provided', function() {
        this.render(hbs`{{ui-input type='search'}}`);

        let selector = this.$('input').attr('type');
        let message = 'sets the type to "search"';
        expect(selector, message).to.eq('search');
    });

    it('triggers an assertion when the wrong input type is provided', function(done) {
        this.set('type', 'text');

        let message = 'trying to render with a bad type throws an error';
        this.render(hbs`{{ui-input type=type}}`);

        try {
            this.set('type', 'test');
        } catch(error) {
            expect(error.name, message).to.eq('Error');
            done();
        }
    });

    it('renders with the value as an attribute', function() {
        this.set('value', 'Test');
        this.render(hbs`{{ui-input value=value}}`);

        let selector = this.$('input').val();
        let message = 'Properly renders with value as an attribute';
        expect(selector, message).to.eq('Test');
    });

    it('renders with the value as a posistionalParam', function() {
        this.set('value', 'Test');
        this.render(hbs`{{ui-input value}}`);

        let selector = this.$('input').val();
        let message = 'Properly renders with value as a positionalParam';
        expect(selector, message).to.eq('Test');
    });

    it('triggers update when typing in to the input', function() {
        this.render(hbs`{{ui-input value=value update=(action (mut value))}}`);
        this.$('input').val('Check').trigger('input');

        let message = 'Value is updated to "Check"';
        expect(this.get('value'), message).to.eq('Check');
    });

    it('triggers update when value is changed', function() {
        this.render(hbs`{{ui-input value=value update=(action (mut value))}}`);
        this.$('input').val('Check').trigger('change');

        let message = 'Value is updated to "Check"';
        expect(this.get('value'), message).to.eq('Check');
    });

    it('keeps the cursor at the correct position', function() {
        this.render(hbs`{{ui-input value update=(action (mut value))}}`);

        ['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd'].forEach((_, index, letters) => {
            let part = letters.slice(0, index + 1).join('');
            run(() => this.$('input').val(part).trigger('input'));

            let selector = this.$('input').get(0).selectionStart;
            let message = 'Cursor is at correct position';
            expect(selector, message).to.eq(index + 1);
        });
    });

    it('adds the placeholder attribute', function() {
        this.render(hbs`{{ui-input placeholder=placeholder}}`);

        let selector = this.$('input');
        let message = 'Does not add placeholder attribute';
        expect(selector.attr('placeholder'), message).to.be.undefined;

        this.set('placeholder', 'Test');
        message = 'Adds placeholder attribute';
        expect(selector.attr('placeholder'), message).to.eq('Test');
    });

    it('adds classes to the input', function() {
        this.render(hbs`{{ui-input class=class}}`);

        let selector = this.$('input');
        let message = 'Does not add any classes';
        expect(selector.attr('class'), message).to.eq('ember-view');

        this.set('class', 'test');
        message = 'Adds class to input';
        expect(selector.attr('class'), message).to.eq('test ember-view');
    });

    it('adds aria-describedby attribute', function() {
        this.render(hbs`{{ui-input ariaDescribedBy=ariaDescribedBy}}`);

        let selector = this.$('input');
        let message = 'Does not add aria-describedby attribute';
        expect(selector.attr('aria-describedby'), message).to.be.undefined;

        this.set('ariaDescribedBy', 'test');

        message = 'Adds aria-describedby attribute';
        expect(selector.attr('aria-describedby'), message).to.eq('test');
    });

    it('adds aria-labelledby attribute', function() {
        this.render(hbs`{{ui-input ariaLabelledBy=ariaLabelledBy}}`);

        let selector = this.$('input');
        let message = 'Does not add aria-labelledby attribute';
        expect(selector.attr('aria-labelledby'), message).to.be.undefined;

        this.set('ariaLabelledBy', 'test');

        message = 'Adds aria-labelledby attribute';
        expect(selector.attr('aria-labelledby'), message).to.eq('test');
    });
});
