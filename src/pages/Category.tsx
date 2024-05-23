// Import statements
import { apiService } from '@app/services/apiService';
import { ContentHeader } from '@components';
import { useEffect, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Table,
  FormGroup,
  Label,
  Alert,
} from 'reactstrap';

// Define the data structure
interface Category {
  name: string;
  description: string;     
  categoryId: string;
}

const Category = () => {
  // State variables
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modal, setModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");

  // Function to toggle the modal
  const toggle = () => setModal(!modal);

  // Function to generate a GUID
  function generateGUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // Function to create a category
  function createCategory() {
    const name = (document.getElementById("categoryName") as HTMLInputElement)
      .value;
    const description = (
      document.getElementById("categoryDescription") as HTMLInputElement
    ).value;

    const newCategory: Category = {
      categoryId: generateGUID(),
      name: name,
      description: description,
    };

    apiService({
      method: "POST",
      url: "https://sacnsommasterdataservice.azurewebsites.net/api/Category",
      data: newCategory,
    })
      .then((response) => {
        console.log(response.data); // Log the data
        setAlertMessage("Category created successfully!");
        setAlertColor("info");
        toggle(); // Close the modal
        setRefreshKey((oldKey) => oldKey + 1); // Trigger a refresh
        setTimeout(() => setAlertMessage(""), 2000); // Clear the alert message after 2 seconds
      })
      .catch((error) => {
        console.error(error);
        setAlertMessage("An error occurred while creating the category.");
        setAlertColor("danger");
      });
  }

  // Fetch data from the API
  useEffect(() => {
    apiService({
      method: "GET",
      url: "https://sacnsommasterdataservice.azurewebsites.net/api/Category",
    })
      .then((response) => {
        console.log(response.data); // Log the data
        setCategories(response.data.data);
      })
      .catch((error) => console.error(error));
  }, [refreshKey]);


  // Function to delete a category

  function handleDelete(categoryId: string) {
    console.log(categoryId);
    apiService({
      method: 'DELETE',
      url: `https://sacnsommasterdataservice.azurewebsites.net/api/Category/${categoryId}`,
    })
    .then(response => {
      console.log(response.data); // Log the data
      setAlertMessage("Category deleted successfully!");
      setAlertColor("info");
      setRefreshKey(oldKey => oldKey + 1); // Trigger a refresh
      setTimeout(() => setAlertMessage(""), 2000); // Clear the alert message after 2 seconds
    })
    .catch(error => {
      console.error(error);
      setAlertMessage("An error occurred while deleting the category.");
      setAlertColor("danger");
    });
    // Here you can call the API to delete the category
    // After successful deletion, you can refresh the categories list
  }

  return (
    <div>
      <ContentHeader title="Category List" />
      {alertMessage && <Alert color={alertColor}>{alertMessage}</Alert>}
      <section className="content">
        <div className="container-fluid">
          <Card>
            <CardHeader className="border-transparent">
              <CardTitle>Category Master</CardTitle>
              <Button
                color="success"
                outline
                security="sm"
                style={{ float: "right" }}
                onClick={toggle}
              >
                Add New
              </Button>
            </CardHeader>

            <CardBody className="p-0">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={index}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <Badge tag="span" color="success">
                          Active
                        </Badge>
                      </td>
                      <td>
                      <FontAwesomeIcon icon={faTrash}  style={{ color: 'red' }} onClick={() => handleDelete(category.categoryId)} />
        </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </section>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Category</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="exampleEmail">Category Name</Label>
              <Input
                id="categoryName"
                name="categoryName"
                placeholder="Name"
                type="text"
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Category Description</Label>
              <Input
                id="categoryDescription"
                name="categoryDescription"
                placeholder=""
                type="text"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createCategory}>
            Add
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Category;
