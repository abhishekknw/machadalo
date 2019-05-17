import React from 'react';
import classnames from 'classnames';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';

const getFilteredSupplierList = (list, supplierId) => {
  if (supplierId) {
    return list.filter((supplier) => supplier.supplier_type_id === supplierId);
  } else {
    return list;
  }
};

const getInventoryAttributes = (supplier) => {
  if (supplier && supplier.supplier_attributes && supplier.supplier_attributes.length) {
    return supplier.supplier_attributes
      .filter((item) => item.type === 'INVENTORY')
      .map((item) => ({ name: item.value.label, count: 1 }));
  }

  return [];
};

const getDropdownOption = (options, value) => {
  if (options) {
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].value === value) {
        return options[i];
      }
    }
  }

  return null;
};

export default class EditBooking extends React.Component {
  constructor(props) {
    super(props);

    const bookingId = this.getBookingId();
    const booking = this.getBookingById({
      id: bookingId,
    });

    let attributes = [];
    let bookingTemplate = {};
    let supplier = {};
    let phase = {};
    let inventories = [];
    if (bookingId && booking && booking.id) {
      attributes = booking.booking_attributes;
      bookingTemplate = this.getBookingTemplateById({
        id: booking.booking_template_id,
      });
      supplier = this.getSupplierById({ id: booking.supplier_id });
      inventories = getInventoryAttributes(supplier);
      phase = this.getPhaseById({ id: booking.phase_id });
    }

    this.state = {
      isEditMode: !!bookingId,
      bookingId,
      errors: {},
      bookingTemplateId: booking.booking_template_id,
      bookingTemplate,
      supplier,
      supplierId: booking.supplier_id,
      attributes,
      inventories,
      phase,
    };

    this.onBookingTemplateChange = this.onBookingTemplateChange.bind(this);
    this.onPhaseChange = this.onPhaseChange.bind(this);
    this.onSupplierChange = this.onSupplierChange.bind(this);
    this.renderBookingAttributeRow = this.renderBookingAttributeRow.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.renderInventoryRow = this.renderInventoryRow.bind(this);
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { getBookingTemplateList, getSupplierList, getBookingList, getPhaseList } = this.props;
    getBookingTemplateList();
    getSupplierList();
    getBookingList({ campaignId: this.getCampaignId() });
    getPhaseList({ campaignId: this.getCampaignId() });
  }

  componentDidUpdate(prevProps) {
    const { booking: prevBooking, supplier: prevSupplier, phase: prevPhase } = prevProps;
    const { booking: newBooking, supplier: newSupplier, phase: newPhase, history } = this.props;

    if (
      prevBooking.isCreatingBooking &&
      !newBooking.isCreatingBooking &&
      newBooking.postBookingSuccess
    ) {
      toastr.success('', 'Booking created successfully');
      history.push(`/r/booking/list/${this.getCampaignId()}`);
    } else if (
      prevBooking.isCreatingBooking &&
      !newBooking.isCreatingBooking &&
      newBooking.putBookingError
    ) {
      toastr.error('', 'Failed to create booking. Please try again later.');
    } else if (
      prevBooking.isUpdatingBooking &&
      !newBooking.isUpdatingBooking &&
      newBooking.putBookingSuccess
    ) {
      toastr.success('', 'Booking updated successfully');
      history.push(`/r/booking/list/${this.getCampaignId()}`);
    } else if (
      prevBooking.isUpdatingBooking &&
      !newBooking.isUpdatingBooking &&
      newBooking.putBookingError
    ) {
      toastr.error('', 'Failed to update Booking. Please try again later.');
    }

    if (
      (prevBooking.isFetchingBookingTemplate && !newBooking.isFetchingBookingTemplate) ||
      (prevSupplier.isFetchingSupplierList && !newSupplier.isFetchingSupplierList) ||
      (prevBooking.isFetchingBooking && !newBooking.isFetchingBooking)
    ) {
      const bookingId = this.getBookingId();
      const booking = this.getBookingById({
        id: bookingId,
      });

      let attributes = [];
      let bookingTemplate = {};
      let supplier = {};
      let phase = {};
      let inventories = [];
      if (bookingId && booking && booking.id) {
        attributes = booking.booking_attributes;
        bookingTemplate = this.getBookingTemplateById({
          id: booking.booking_template_id,
        });
        supplier = this.getSupplierById({ id: booking.supplier_id });
        inventories = getInventoryAttributes(supplier);
        phase = this.getPhaseById({ id: booking.phase_id });
      }

      this.setState({
        isEditMode: !!bookingId,
        bookingId,
        bookingTemplateId: booking.booking_template_id,
        bookingTemplate,
        supplier,
        supplierId: booking.supplier_id,
        attributes,
        inventories,
        phase,
      });
    }

    if (prevPhase.isFetchingPhase && !newPhase.isFetchingPhase) {
      const bookingId = this.getBookingId();
      const booking = this.getBookingById({
        id: bookingId,
      });

      this.setState({
        phase: this.getPhaseById({ id: booking.phase_id }),
      });
    }
  }

  // handleInputChange(name) {
  //   this.setState({
  //     name
  //   });
  // }

  onBookingTemplateChange(template) {
    this.setState({
      bookingTemplate: template,
      bookingTemplateId: template.id,
      supplierId: template.supplier_type_id,
      attributes: template.booking_attributes,
    });
  }

  onSupplierChange(supplier) {
    this.setState({
      supplier: supplier,
      inventories: getInventoryAttributes(supplier),
    });
  }

  onPhaseChange(phase) {
    this.setState({
      phase,
    });
  }

  handleAttributeChange(attribute, index) {
    const attributes = [...this.state.attributes];

    attributes[index] = attribute;

    this.setState({
      attributes,
    });
  }

  handleInventoryChange(inventory, index) {
    const inventories = [...this.state.inventories];

    inventories[index] = inventory;

    this.setState({
      inventories,
    });
  }

  handleImageChange(event) {
    this.setState({
      uploadedImage: event.target.files[0],
    });
  }

  onUpload(index) {
    console.log(index);
    const { supplier, attributes, bookingId, isEditMode, uploadedImage } = this.state;
    console.log(attributes);
    const { uploadHashtagImage } = this.props;

    let data = new FormData();
    data.append('file', uploadedImage);
    data.append('supplier_id', supplier.id);
    data.append('campaign_id', this.getCampaignId());
    data.append('hashtag', attributes[index].value);
    data.append('name', attributes[index].name);
    data.append('comment', attributes[index].comment || '');

    if (isEditMode) {
      uploadHashtagImage({ id: bookingId, data });
    }
  }

  onSubmit() {
    const {
      bookingTemplateId,
      bookingTemplate,
      supplier,
      attributes,
      isEditMode,
      bookingId,
      inventories,
      phase,
    } = this.state;
    const { postBooking, putBooking } = this.props;

    const data = {
      booking_template_id: bookingTemplateId,
      supplier_id: supplier.id,
      campaign_id: this.getCampaignId(),
      organisation_id: bookingTemplate.organisation_id,
      booking_attributes: attributes,
      inventory_counts: inventories,
      phase_id: phase.id,
    };

    if (isEditMode) {
      putBooking({ id: bookingId, data });
    } else {
      postBooking({ data });
    }
  }

  getCampaignId() {
    const { match } = this.props;
    return match.params.campaignId;
  }

  getBookingId() {
    const { match } = this.props;
    return match.params.bookingId;
  }

  getBookingById({ id }) {
    const { booking } = this.props;
    const { bookingList } = booking;

    for (let i = 0, l = bookingList.length; i < l; i += 1) {
      if (bookingList[i].id === id) {
        return bookingList[i];
      }
    }

    return {};
  }

  getBookingTemplateById({ id }) {
    const { booking } = this.props;
    const { bookingTemplateList } = booking;

    for (let i = 0, l = bookingTemplateList.length; i < l; i += 1) {
      if (bookingTemplateList[i].id === id) {
        return bookingTemplateList[i];
      }
    }

    return {};
  }

  getSupplierById({ id }) {
    const { supplier } = this.props;
    const { supplierList } = supplier;

    for (let i = 0, l = supplierList.length; i < l; i += 1) {
      if (supplierList[i].id === id) {
        return supplierList[i];
      }
    }

    return {};
  }

  getPhaseById({ id }) {
    const { phase } = this.props;
    const { phaseList } = phase;

    for (let i = 0, l = phaseList.length; i < l; i += 1) {
      if (phaseList[i].id === id) {
        return phaseList[i];
      }
    }

    return {};
  }

  renderBookingAttributeRow(attribute, index) {
    const handleAttributeInputChange = (event) => {
      const newAttribute = { ...attribute };

      if (
        newAttribute.type === 'DROPDOWN' ||
        newAttribute.type === 'MULTISELECT' ||
        newAttribute.type === 'HASHTAG'
      ) {
        newAttribute.value = event.value;
      } else {
        newAttribute.value = event.target.value;
      }

      this.handleAttributeChange(newAttribute, index);
    };

    let typeInput = null;

    switch (attribute.type) {
      case 'FLOAT':
        typeInput = (
          <input type="number" onChange={handleAttributeInputChange} value={attribute.value} />
        );
        break;

      case 'STRING':
        typeInput = (
          <input type="text" onChange={handleAttributeInputChange} value={attribute.value} />
        );
        break;

      case 'DROPDOWN':
        let options = attribute.options.map((option) => ({
          label: option,
          value: option,
        }));
        typeInput = (
          <Select
            className={classnames('select')}
            options={options}
            getOptionValue={(option) => option.label}
            getOptionLabel={(option) => option.value}
            onChange={handleAttributeInputChange}
            value={getDropdownOption(options, attribute.value)}
          />
        );
        break;

      case 'EMAIL':
        typeInput = (
          <input type="email" onChange={handleAttributeInputChange} value={attribute.value} />
        );
        break;

      case 'MULTISELECT':
        typeInput = (
          <Select
            className={classnames('select')}
            options={attribute.options}
            getOptionValue={(option) => option}
            getOptionLabel={(option) => option}
            onChange={handleAttributeInputChange}
            value={getDropdownOption(attribute.options, attribute.value)}
          />
        );
        break;

      case 'HASHTAG':
        options = attribute.options.map((option) => ({
          label: option,
          value: option,
        }));
        typeInput = (
          <div>
            <div className="form-control">
              <input
                type="file"
                id="uploadedImage"
                accept="image/png, image/jpeg"
                onChange={this.handleImageChange}
              />
            </div>
            <div>
              <br />
              <Select
                className={classnames('select')}
                options={options}
                getOptionValue={(option) => option.label}
                getOptionLabel={(option) => option.value}
                onChange={handleAttributeInputChange}
                value={getDropdownOption(options, attribute.value)}
              />
            </div>
            <div>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => this.onUpload(index)}
              >
                Upload
              </button>
            </div>
          </div>
        );
        break;

      default:
        console.log('Unsupported attribute type');
        break;
    }

    return (
      <div className="supplier" key={index}>
        <div className="form-control">&nbsp;</div>
        <div className="form-control">
          <p>
            {attribute.name}
            {attribute.is_required ? <span style={{ color: '#e2402e' }}>*</span> : null}
          </p>
        </div>

        <div className="form-control">{typeInput}</div>
      </div>
    );
  }

  renderInventoryRow(inventory, index) {
    const { isEditMode } = this.state;
    const onCountChange = (event) => {
      if (event.target.value && !isNaN(+event.target.value) && +event.target.value >= 0) {
        const newInventory = { ...inventory, count: +event.target.value };

        this.handleInventoryChange(newInventory, index);
      }
    };

    return (
      <div className="supplier" key={index}>
        <div className="form-control">&nbsp;</div>
        <div className="form-control">
          <p>{inventory.name}</p>
        </div>

        <div className="form-control">
          <input
            type="number"
            onChange={onCountChange}
            value={inventory.count}
            disabled={isEditMode}
          />
        </div>
      </div>
    );
  }

  render() {
    const { errors, attributes, inventories, isEditMode } = this.state;
    const { booking, supplier, phase } = this.props;
    const { supplierList } = supplier;
    const { bookingTemplateList } = booking;
    const { phaseList } = phase;
    const filterSupplierList = getFilteredSupplierList(supplierList, this.state.supplierId);

    return (
      <div className="booking-base__create create">
        <div className="create__title">
          <h3>Booking - Edit</h3>
        </div>

        <div className="create__form">
          <form onSubmit={this.onSubmit}>
            <div className="create__form__body">
              {/*<div className="form-control form-control--column">
                <label>*Enter Name For Booking</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  className={classnames({ error: errors.name })}
                />
                {errors.name ? (
                  <p className="message message--error">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>*/}
            </div>

            <div className="create__form__header">Select Booking Template</div>

            <div className="create__form__body">
              <div className="form-control form-control--column">
                <Select
                  className={classnames('select', {
                    error: errors.bookingTemplateId,
                  })}
                  options={bookingTemplateList}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  value={this.state.bookingTemplate}
                  onChange={this.onBookingTemplateChange}
                />
                {errors.bookingTemplateId ? (
                  <p className="message message--error">{errors.bookingTemplateId.message}</p>
                ) : null}
              </div>

              {attributes && attributes.length ? (
                <div className="supplier supplier__header">
                  <div className="form-control">&nbsp;</div>
                  <div className="form-control">
                    <h4>Field</h4>
                  </div>

                  <div className="form-control">
                    <h4>Type</h4>
                  </div>
                </div>
              ) : null}

              {attributes && attributes.length
                ? attributes.map(this.renderBookingAttributeRow)
                : null}
            </div>

            <div className="create__form__header">Select supplier</div>

            <div className="create__form__body">
              <div className="form-control form-control--column">
                <Select
                  className={classnames('select', {
                    error: errors.supplier,
                  })}
                  options={filterSupplierList}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  value={this.state.supplier}
                  onChange={this.onSupplierChange}
                  isDisabled={isEditMode}
                />
                {errors.supplier ? (
                  <p className="message message--error">{errors.supplier.message}</p>
                ) : null}
              </div>

              {inventories && inventories.length ? (
                <div className="supplier supplier__header">
                  <div className="form-control">&nbsp;</div>
                  <div className="form-control">
                    <h4>Inventory</h4>
                  </div>

                  <div className="form-control">
                    <h4>Count</h4>
                  </div>
                </div>
              ) : null}

              {inventories && inventories.length ? inventories.map(this.renderInventoryRow) : null}
            </div>

            <div className="create__form__header">Select phase</div>

            <div className="create__form__body">
              <div className="form-control form-control--column">
                <Select
                  className={classnames('select', {
                    error: errors.phaseId,
                  })}
                  options={phaseList}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.phase_no}
                  value={this.state.phase}
                  onChange={this.onPhaseChange}
                />
                {errors.phaseId ? (
                  <p className="message message--error">{errors.phaseId.message}</p>
                ) : null}
              </div>
            </div>
          </form>
        </div>

        <div className="create__actions">
          <button type="button" className="btn btn--danger" onClick={this.onSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}
