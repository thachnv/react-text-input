import React from 'react';
import styles from './TextInput.less';
import Tooltip from 'rc-tooltip';

export default class TextInput extends React.Component {
  constructor(...args) {
    super(...args);
    this.onChange = this.onChange.bind(this);
    this.state = {
      showError: false,
    };
  }

  componentWillMount() {
    this.setState({
      value: this.props.value,
    });
  }

  componentDidMount() {
  }

  componentWillReceiveProps(props) {
    if (this.state.value !== props.value) {
      const errorMessage = this.props.validation(props.value);
      this.setState({
        haveError: !!errorMessage,
        errorMessage,
        value: props.value,
      });
    }
  }

  onKeyPress(e) {
    const charCode = e ? e.charCode : e.which;
    if (!this.validateNumericInput(charCode)) {
      e.preventDefault();
    }
  }

  onChange(e) {
    const value = e.target.value;
    const errorMessage = this.props.validation(value);
    this.setState({
      haveError: !!errorMessage,
      errorMessage,
      value,
    }, () => {
      if (this.props.onValueChanged) {
        this.props.onValueChanged(value);
      }
    });
  }

  validateNumericInput(keyCode) {
    return keyCode === 8 || keyCode === 46 || keyCode === 37 ||
      keyCode === 39 || (keyCode >= 48 && keyCode <= 57);
  }

  render() {
    return (
      <Tooltip
        visible={!this.props.hideError && this.state.haveError}
        trigger={[]}
        overlayStyle={{ zIndex: 1000 }}
        overlay={<span>{this.state.errorMessage}</span>}
      >
        <input
          type="text"
          value={this.state.value}
          disabled={this.props.disabled}
          placeholder={this.props.placeHolder}
          className={styles.Input}
          readOnly={this.props.readOnly}
          onKeyPress={(e) => this.onKeyPress(e)}
          onChange={this.onChange}
        />
      </Tooltip>
    );
  }
}
TextInput.propTypes = {
  value: React.PropTypes.any,
  hideError: React.PropTypes.bool,
  readOnly: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  inputType: React.PropTypes.string,
};
