import React from 'react';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';

import OptionModal from './../../Modals/OptionModal';

const optionStyle = {
  fontSize: '12px',
  margin: '0',
  marginTop: '5px',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const AttributeTypes = [
  { value: 'FLOAT', label: 'Float' },
  { value: 'STRING', label: 'Text' },
  { value: 'DROPDOWN', label: 'Dropdown' },
  { value: 'EMAIL', label: 'Email' },
];

// Get attribute type option from string
const getAttributeTypeOption = (value) => {
  for (let i = 0, l = AttributeTypes.length; i < l; i += 1) {
    if (AttributeTypes[i].value === value) {
      return AttributeTypes[i];
    }
  }

  return { value };
};

export default class CreateType extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      base_attributes: [{ name: '', type: '', is_required: false }],
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
      inventory_type: 'space_based',
      isDisabled: false,
    };

    this.onAddAttribute = this.onAddAttribute.bind(this);
    this.onRemoveAttribute = this.onRemoveAttribute.bind(this);
    this.renderAttributeRow = this.renderAttributeRow.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancelOptionModal = this.onCancelOptionModal.bind(this);
    this.onSubmitOptionModal = this.onSubmitOptionModal.bind(this);
    this.onOpenOptionModal = this.onOpenOptionModal.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  onCancelOptionModal() {
    this.setState({
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
    });
  }

  onSubmitOptionModal(options, attributeInfo) {
    this.setState({
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
    });

    let newAttributes = Object.assign({}, attributeInfo.attribute, {
      type: attributeInfo.attributeType,
      options: options,
    });
    this.handleAttributeChange(newAttributes, attributeInfo.attrIndex);
  }

  onOpenOptionModal(options, attributeType, attribute, attrIndex) {
    this.setState({
      showOptionModal: true,
      attributeOptions: options,
      attributeInfo: {
        attributeType,
        attribute,
        attrIndex,
      },
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const isDisabled = this.state.isDisabled;
    let value = isDisabled;
    this.setState({
      isDisabled: !value,
    });

    this.props.postBaseInventory({ data: this.state }, () => {
      this.setState({
        isDisabled: value,
      });
      toastr.success('', 'Base Inventory created successfully');
      this.props.history.push(`/r/inventory/base/list`);
    });
  }

  onAddAttribute() {
    const newAttributes = this.state.base_attributes.slice();

    newAttributes.push({
      name: '',
      type: '',
      is_required: false,
    });

    this.setState({
      base_attributes: newAttributes,
    });
  }

  onRemoveAttribute(index) {
    const newAttributes = this.state.base_attributes.slice();
    newAttributes.splice(index, 1);
    this.setState({
      base_attributes: newAttributes,
    });
  }

  handleAttributeChange(attribute, index) {
    const attributes = this.state.base_attributes.slice();

    attributes.splice(index, 1, attribute);

    this.setState({
      base_attributes: attributes,
    });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/inventory/base/list`);
  }

  renderAttributeRow(attribute, attrIndex) {
    const onNameChange = (event) => {
      const newAttribute = Object.assign({}, attribute);

      newAttribute.name = event.target.value;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onTypeChange = (item) => {
      if (item.value === 'DROPDOWN') {
        this.setState({
          showOptionModal: true,
          columnOptions: [''],
          attributeInfo: {
            attributeType: item.value,
            attribute,
            attrIndex,
          },
        });
      }
      const newAttribute = Object.assign({}, attribute);

      newAttribute.type = item.value;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onRequiredChange = (event) => {
      const newAttribute = Object.assign({}, attribute);

      newAttribute.is_required = !!event.target.checked;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    return (
      <div className="createform__form__row" key={`row-${attrIndex}`}>
        <div className="createform__form__inline">
          <div className="form-control">
            <input type="text" placeholder="Name" value={attribute.name} onChange={onNameChange} />
          </div>

          <div className="form-control">
            <Select
              options={AttributeTypes}
              classNamePrefix="form-select"
              value={getAttributeTypeOption(attribute.type)}
              onChange={onTypeChange}
            />

            {attribute.type === 'DROPDOWN' ? (
              <p
                className="show-option"
                style={optionStyle}
                onClick={() =>
                  this.onOpenOptionModal(
                    attribute.options,
                    attribute.type,
                    attribute,
                    attribute.attrIndex
                  )
                }
              >
                Show Options
              </p>
            ) : (
              ''
            )}
          </div>

          <div className="form-control required-field">
            <div>Is it required?</div>
            <input
              type="checkbox"
              className="input-checkbox"
              value={attribute.is_required}
              onChange={onRequiredChange}
            />
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => this.onRemoveAttribute(attrIndex)}
            >
              Remove Attribute
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { isDisabled } = this.state;
    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Create - Inventory Standard Template</h3>
        </div>
        <div className="createform__form">
          <form onSubmit={this.onSubmit}>
            <button type="button" className="btn btn--danger" onClick={this.onBack}>
              <i className="fa fa-arrow-left" aria-hidden="true" />
              &nbsp; Back
            </button>
            <br />
            <br />
            <div className="createform__form__inline">
              <div className="form-control">
                <label>*Enter Name For Base Inventory</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="createform__form__header">Attributes</div>

            <div>{this.state.base_attributes.map(this.renderAttributeRow)}</div>

            <div className="createform__form__inline">
              <div className="createform__form__action">
                <button type="button" className="btn btn--danger" onClick={this.onAddAttribute}>
                  Add Attribute
                </button>
              </div>

              <div className="createform__form__action">
                <button type="submit" className="btn btn--danger" disabled={isDisabled}>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <OptionModal
          showOptionModal={this.state.showOptionModal}
          onCancel={this.onCancelOptionModal}
          onSubmit={this.onSubmitOptionModal}
          options={this.state.attributeOptions}
          columnInfo={this.state.attributeInfo}
        />
      </div>
    );
  }
}
