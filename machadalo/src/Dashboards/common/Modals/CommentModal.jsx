import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { showHideModalAtom } from '../../Recoil/States/Machadalo/Constant';
import { useRecoilState } from 'recoil';
function CommentModal() {
  const [showHideModal, setshowHideModal] = useRecoilState(showHideModalAtom);
  const [showModal, setShow] = useState(showHideModal.comment);
  const handleClose = () => setshowHideModal({ ...showHideModal, comment: { show: false } });
  //   const handleShow = () => setShow(true);

  return (
    <>
      {/* <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>
      </div> */}
      <Modal show={showHideModal.comment.show} onHide={handleClose} className='wpModal'>
        <Modal.Header closeButton>
          <Modal.Title>Comment Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className='wp-form'>
            <div class="form-group">
              <label for="exampleInputEmail1">whatsapp Number</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
              {/* <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small> */}
            </div>
            {/* <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" id="exampleInputPassword1" />
            </div> */}
            {/* <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="exampleCheck1" />
              <label class="form-check-label" for="exampleCheck1">
                Check me out
              </label>
            </div> */}
            <button type="submit" class="btn btn-primary submit-btn">
              Submit
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='submit-btn' onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CommentModal;
