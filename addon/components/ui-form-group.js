import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const {
    computed,
    get,
    guidFor,
    assert,
    isPresent
} = Ember;

const LABEL_MSG = 'You must include a "label" attribute in all uses of "{{ui-form-group}}" for disabled users. If you want to hide the label visually, you may also provide the attribute "labelVisible=false".';
const UPDATE_MSG = 'You must pass an "update" attribute in all uses of "{{ui-form-group}}" for the value to be updated. The most common use is "update=(action (mut value))".';

export default Ember.Component.extend({
    classNames: ['form-group'],
    layout: hbs`
        {{#if label}}
            <label class="{{unless labelVisible 'sr-only'}}" for="{{inputId}}" test-id="txtLabel">{{label}}</label>
        {{/if}}

        {{component inputComponent
            id=inputId
            ariaDescribedBy=descriptionId
            type=inputType
            value=value
            update=update
        }}

        {{#if description}}
            <p class="help-block {{unless descriptionVisible 'sr-only'}}" id="{{descriptionId}}" test-id="txtDescription">{{description}}</p>
        {{/if}}
    `,

    labelVisible: true,
    description: null,
    descriptionVisible: true,
    value: null,
    inputType: 'text',

    verifyPresence: (value, message) => assert(message, isPresent(value)),

    label: computed({
        get() {
            this.verifyPresence(null, LABEL_MSG);
            return null;
        },
        set(key, label) {
            this.verifyPresence(label, LABEL_MSG);
            return label;
        }
    }),

    update: computed({
        get() {
            this.verifyPresence(null, UPDATE_MSG);
            return null;
        },
        set(key, update) {
            this.verifyPresence(update, UPDATE_MSG);
            return update;
        }
    }),

    inputComponent: computed('inputType', function() {
        return 'ui-input';
    }),

    uuid: computed(function() {
        return guidFor(this);
    }),

    inputId: computed('id', function() {
        const guid = get(this, 'uuid');

        return `${guid}-input`;
    }),

    descriptionId: computed('description', function() {
        const uuid = get(this, 'uuid');
        const hasDescription = !!get(this, 'description');

        return hasDescription ? `${uuid}-description` : undefined;
    })
});
