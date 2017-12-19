export function CfSelectionList (Repeater) {
    return Repeater.extend({
        props: {
            value: {},
            multiple: {
                type: Boolean,
                default: false
            }
        },

        methods: {
            /**
             * Help repeater to emit v-model changing when using native selects.
             * We need to implement this because of Vue's render() limitation.
             *
             * @see https://vuejs.org/v2/guide/render-function.html#v-model
             */
            getRepeaterRootOptions () {
                if (this.wrap === 'select') {
                    let self = this
                    return {
                        domProps: {
                            value: this.value,
                            multiple: this.multiple
                        },
                        on: {
                            input: function (event) {
                                self.$emit('input', self._getNativeSelectValue(event.target))
                            }
                        }
                    }
                }

                return {}
            },

            /**
             * Special repeater method, that enable
             * us to bypass child methods to repeating items.
             *
             * @return {{isItemSelected: *}}
             */
            getRepeatedSlotProps () {
                return {
                    'isItemSelected': this.isItemSelected,
                    'select': this.select,
                    'getKey': this.getKey
                }
            },

            select (item) {
                this.$emit('input', this._select(item, this.value))
            },

            isItemSelected (item) {
                return this._isItemSelected(item, this.value)
            },

            getKey (item) {
                return this.collection._keyGetter(item)
            },

            /**
             * Check given item is selected
             *
             * @param item
             * @param currentValue
             * @return {boolean}
             * @private
             */
            _isItemSelected (item, currentValue) {
                if (!this.multiple) {
                    return currentValue === this.getKey(item)
                }

                return currentValue.indexOf(this.getKey(item)) > -1
            },

            /**
             * Select item before emitting new model
             *
             * @param item
             * @param currentValue
             * @return {*}
             * @private
             */
            _select (item, currentValue) {
                if (!this.multiple) {
                    return this.getKey(item)
                }

                var i = currentValue.indexOf(this.getKey(item))
                if (i === -1) {
                    currentValue.push(this.getKey(item))
                }
                else {
                    currentValue.splice(i, 1)
                }
                return currentValue
            },

            /**
             * Get select value, also can get multiple select value
             *
             * @param el
             * @return {*}
             * @private
             */
            _getNativeSelectValue (el) {
                if (!this.multiple) return el.value

                let result = []
                let options = el && el.options

                for (let i = 0; i < options.length; i++) {
                    if (options[i].selected) {
                        result.push(options[i].value || options[i].text);
                    }
                }

                return result
            }
        }
    })
}
