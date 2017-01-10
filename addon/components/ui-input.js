import Ember from 'ember';

const {
    Component,
    computed,
    get,
    isNone,
    assert,
    run: {
        schedule
    }
} = Ember;

const ALLOWED_TYPES = ['text', 'search', 'tel', 'password', 'num'];

const UiInputComponent = Component.extend({
    tagName: 'input',

    attributeBindings: [
        'type',
        'value',
        'placeholder',
        'ariaDescribedBy:aria-describedby',
        'ariaLabelledBy:aria-labelledby'
    ],

    value: null,
    ariaDescribedBy: null,
    ariaLabelledBy: null,

    change(event) {
        this._processNewValue(event.target.value);
    },
    input(event) {
        this._processNewValue(event.target.value);
    },

    _processNewValue(value) {
        if (get(this, '_value') !== value) {
            this.sendAction('update', value);
        }

        schedule('afterRender', this, '_syncValue');
    },

    _syncValue() {
        if (this.isDestroyed || this.isDestroying) {
            return;
        }

        let actualValue = get(this, '_value');
        let renderedValue = this.readDOMAttr('value');

        if (!isNone(actualValue) && !isNone(renderedValue) && actualValue.toString() !== renderedValue.toString()) {
            let element = this.$();
            let rawElement = element.get(0);

            let start;
            let end;

            try {
                start = rawElement.selectionStart;
                end = rawElement.selectionEnd;
            } catch(e) {
                // no-op
            }

            element.val(actualValue);

            try {
                rawElement.setSelectionRange(start, end);
            } catch(e) {
                // no-op
            }
        }
    },

    type: computed({
        get() {
            return 'text';
        },

        set(key, type) {
            assert(`The {{ui-input}} component does not support type="${type}".`, ALLOWED_TYPES.indexOf(type) !== -1);
            return type;
        }
    })
});

UiInputComponent.reopenClass({
    positionalParams: ['value']
});

export default UiInputComponent;

