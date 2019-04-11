import React from 'react';
import classnames from 'classnames';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';

const getFilteredEntityList = (list, entityId) => {
  if (entityId) {
    return list.filter(entity => entity.entity_type_id === entityId);
  } else {
    return list;
  }
};

export default class EditBooking extends React.Component {
  constructor(props) {
    super(props);

    const bookingId = this.getBookingId();
    const booking = this.getBookingById({
      id: bookingId
    });

    let attributes = [];
    let bookingTemplate = {};
    let entity = {};
    if (bookingId && booking && booking.id) {
      attributes = booking.booking_attributes;
      bookingTemplate = this.getBookingTemplateById({
        id: booking.booking_template_id
      });
      entity = this.getEntityById({ id: booking.entity_id });
    }

    this.state = {
      isEditMode: !!bookingId,
      bookingId,
      errors: {},
      bookingTemplateId: booking.booking_template_id,
      bookingTemplate,
      entity,
      entityId: booking.entity_id,
      attributes
    };

    // this.handleInputChange = this.handleInputChange.bind(this);
    this.onBookingTemplateChange = this.onBookingTemplateChange.bind(this);
    this.onEntityChange = this.onEntityChange.bind(this);
    this.renderBookingAttributeRow = this.renderBookingAttributeRow.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getBookingTemplateList();
    this.props.getEntityList();
    this.props.getBookingList({ campaignId: this.getCampaignId() });
  }

  componentDidUpdate(prevProps) {
    const { booking: prevBooking, entity: prevEntity } = prevProps;
    const { booking: newBooking, entity: newEntity, history } = this.props;
    const { isUpdatingBooking: prevIsUpdatingBooking } = prevBooking;
    const {
      postBookingSuccess,
      postBookingError,
      isUpdatingBooking: newIsUpdatingBooking
    } = newBooking;

    if (prevIsUpdatingBooking && !newIsUpdatingBooking && postBookingSuccess) {
      toastr.success('', 'Booking updated successfully');
      history.push(`/r/booking/campaigns`);
    } else if (
      prevIsUpdatingBooking &&
      !newIsUpdatingBooking &&
      postBookingError
    ) {
      toastr.error('', 'Failed to update  Booking. Please try again later.');
    }

    if (
      (prevBooking.isFetchingBookingTemplate &&
        !newBooking.isFetchingBookingTemplate) ||
      (prevEntity.isFetchingEntityList && !newEntity.isFetchingEntityList) ||
      (prevBooking.isFetchingBooking && !newBooking.isFetchingBooking)
    ) {
      const bookingId = this.getBookingId();
      const booking = this.getBookingById({
        id: bookingId
      });

      let attributes = [];
      let bookingTemplate = {};
      let entity = {};
      if (bookingId && booking && booking.id) {
        attributes = booking.booking_attributes;
        bookingTemplate = this.getBookingTemplateById({
          id: booking.booking_template_id
        });
        entity = this.getEntityById({ id: booking.entity_id });
      }

      this.setState({
        isEditMode: !!bookingId,
        bookingId,
        bookingTemplateId: booking.booking_template_id,
        bookingTemplate,
        entity,
        entityId: booking.entity_id,
        attributes
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
      entityId: template.entity_type_id,
      attributes: template.booking_attributes
    });
  }

  onEntityChange(entity) {
    this.setState({
      entity: entity
    });
  }

  handleAttributeChange(attribute, index) {
    const attributes = [...this.state.attributes];

    attributes[index] = attribute;

    this.setState({
      attributes
    });
  }

  onSubmit() {
    const {
      bookingTemplateId,
      bookingTemplate,
      entity,
      attributes
    } = this.state;

    const data = {
      booking_template_id: bookingTemplateId,
      entity_id: entity.id,
      campaign_id: this.getCampaignId(),
      organisation_id: bookingTemplate.organisation_id,
      booking_attributes: attributes
    };

    this.props.postBooking({ data });
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

  getEntityById({ id }) {
    const { entity } = this.props;
    const { entityList } = entity;

    for (let i = 0, l = entityList.length; i < l; i += 1) {
      if (entityList[i].id === id) {
        return entityList[i];
      }
    }

    return {};
  }

  renderBookingAttributeRow(attribute, index) {
    const handleAttributeInputChange = event => {
      const newAttribute = { ...attribute };

      if (
        newAttribute.type === 'DROPDOWN' ||
        newAttribute.type === 'MULTISELECT'
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
          <input
            type="number"
            onChange={handleAttributeInputChange}
            value={attribute.value}
          />
        );
        break;

      case 'STRING':
        typeInput = (
          <input
            type="text"
            onChange={handleAttributeInputChange}
            value={attribute.value}
          />
        );
        break;

      case 'DROPDOWN':
        typeInput = (
          <Select
            className={classnames('select')}
            options={attribute.options.map(option => ({
              label: option,
              value: option
            }))}
            getOptionValue={option => option.label}
            getOptionLabel={option => option.value}
            onChange={handleAttributeInputChange}
            value={attribute.value}
          />
        );
        break;

      case 'EMAIL':
        typeInput = (
          <input
            type="email"
            onChange={handleAttributeInputChange}
            value={attribute.value}
          />
        );
        break;

      case 'MULTISELECT':
        typeInput = (
          <Select
            className={classnames('select')}
            options={attribute.options}
            getOptionValue={option => option}
            getOptionLabel={option => option}
            onChange={handleAttributeInputChange}
            value={attribute.value}
          />
        );
        break;

      default:
        console.log('Unsupported attribute type');
        break;
    }

    return (
      <div className={classnames('entity')} key={index}>
        <div className="form-control">&nbsp;</div>
        <div className="form-control">
          <p>
            {attribute.name}
            {attribute.is_required ? (
              <span style={{ color: '#e2402e' }}>*</span>
            ) : null}
          </p>
        </div>

        <div className="form-control">{typeInput}</div>
      </div>
    );
  }

  render() {
    const { errors, attributes } = this.state;
    const { booking, entity } = this.props;
    const { entityList } = entity;
    const { bookingTemplateList } = booking;
    const filterEntityList = getFilteredEntityList(
      entityList,
      this.state.entityId
    );

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
                    error: errors.bookingTemplateId
                  })}
                  options={bookingTemplateList}
                  getOptionValue={option => option.id}
                  getOptionLabel={option => option.name}
                  value={this.state.bookingTemplate}
                  onChange={this.onBookingTemplateChange}
                />
                {errors.bookingTemplateId ? (
                  <p className="message message--error">
                    {errors.bookingTemplateId.message}
                  </p>
                ) : null}
              </div>

              {attributes && attributes.length ? (
                <div className="entity entity__header">
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

            <div className="create__form__header">Select Entity</div>

            <div className="create__form__body">
              <div className="form-control form-control--column">
                <Select
                  className={classnames('select', {
                    error: errors.entity
                  })}
                  options={filterEntityList}
                  getOptionValue={option => option.id}
                  getOptionLabel={option => option.name}
                  value={this.state.entity}
                  onChange={this.onEntityChange}
                />
                {errors.entity ? (
                  <p className="message message--error">
                    {errors.entity.message}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </div>

        <div className="create__actions">
          <button
            type="button"
            className="btn btn--danger"
            onClick={this.onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
