import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function EditModal({
  showModal,
  review,
  apartment,
  userToken,
  getRate,
  setFormData,
  setShowModal,
}) {
  const handleCloseModal = () => setShowModal(false);
  const [editedRating, setEditedRating] = useState(0);
  const [editedReview, setEditedReview] = useState("");
  useEffect(() => {
    // fetch apartment data
    axios
      .get(`http://localhost:9090/appartments/review/${review._id}`)
      .then((response) => {
        setEditedRating(response.data.Rating);
        setEditedReview(response.data.Description);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleEditReview = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9090/appartments/reviews/${review._id}`,
        {
          rating: editedRating,
          description: editedReview,
          appartmentId: apartment.id,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // authentication is required
          },
        }
      );
      const ResData = response.data;
      console.log(ResData);
      handleCloseModal();
      setFormData({
        rating: "",
        review: "",
      });
      getRate();
    } catch (error) {}
  };
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditReview();
          }}
        >
          <Form.Group>
            <Form.Label>Rating (0-5)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="5"
              value={editedRating}
              onChange={(e) => setEditedRating(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">Error</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Review (20-250 characters)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              minLength={15}
              maxLength={250}
              value={editedReview}
              onChange={(e) => setEditedReview(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">Error</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}