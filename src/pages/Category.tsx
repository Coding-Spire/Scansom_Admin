// Import statements
import { apiService } from "@app/services/apiService";
import { ContentHeader } from "@components";
import { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
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
} from "reactstrap";

import { Spinner,CustomInput } from "reactstrap";
// Define the data structure
interface Category {
  name: string;
  description: string;
  categoryId: string;
  status:boolean;
  featureCategory: boolean;

}

const Category = () => {
  // State variables
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modal, setModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  // State for controlling the visibility of the spinner
  const [loading, setLoading] = useState(true);

  const [statusSwitch, setStatusSwitch] = useState(false);
const [featureCategorySwitch, setFeatureCategorySwitch] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

//to enable edit 
const [isEditMode, setIsEditMode] = useState(false);

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


  // Function to update a category
  function updateCategory() {

  const name = (document.getElementById("categoryName") as HTMLInputElement)
      .value;
    const description = (
      document.getElementById("categoryDescription") as HTMLInputElement
    ).value;
    const status = (document.getElementById("statusSwitch") as HTMLInputElement)
      .checked;
    const featureCategory = (
      document.getElementById("featureCategorySwitch") as HTMLInputElement
    ).checked;
    const categoryId = (document.getElementById("categoryId") as HTMLInputElement)
      .value;

    const newCategory: Category = {
      categoryId: categoryId,
      name: name,
      description: description,
      status: status,
      featureCategory: featureCategory,
    };

    apiService({
      method: "PUT",
      url: "https://sacnsommasterdataservice.azurewebsites.net/api/Category",
      data: newCategory,
    })
      .then((response) => {
        console.log(response.data); // Log the data
        setAlertMessage("Category Updated successfully!");
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

  // Function to create a category
  function createCategory() {
    const name = (document.getElementById("categoryName") as HTMLInputElement)
      .value;
    const description = (
      document.getElementById("categoryDescription") as HTMLInputElement
    ).value;
    const status = (document.getElementById("statusSwitch") as HTMLInputElement)
      .checked;
    const featureCategory = (
      document.getElementById("featureCategorySwitch") as HTMLInputElement
    ).checked;

    const newCategory: Category = {
      categoryId: generateGUID(),
      name: name,
      description: description,
      status: status,
      featureCategory: featureCategory,
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
    setLoading(true); // Show the spinner
    apiService({
      method: "GET",
      url: "https://sacnsommasterdataservice.azurewebsites.net/api/Category",
    })
      .then((response) => {
        console.log(response.data); // Log the data
        setCategories(response.data.data);
        setLoading(false); // Hide the spinner
      })
      .catch((error) => console.error(error));
  }, [refreshKey]);

  // Function to delete a category

  function handleDelete(categoryId: string) {
    console.log(categoryId);
    apiService({
      method: "DELETE",
      url: `https://sacnsommasterdataservice.azurewebsites.net/api/Category/${categoryId}`,
    })
      .then((response) => {
        console.log(response.data); // Log the data
        setAlertMessage("Category deleted successfully!");
        setAlertColor("info");
        setRefreshKey((oldKey) => oldKey + 1); // Trigger a refresh
        setTimeout(() => setAlertMessage(""), 2000); // Clear the alert message after 2 seconds
      })
      .catch((error) => {
        console.error(error);
        setAlertMessage("An error occurred while deleting the category.");
        setAlertColor("danger");
      });
    // Here you can call the API to delete the category
    // After successful deletion, you can refresh the categories list
  }

  function handleEdit(categoryId: string) {
    const category = categories.find((category) => category.categoryId === categoryId);
    
    if (category) {
      setSelectedCategory(category);
      console.log(category);
      setModal(true); // Open the modal
      setIsEditMode(true); // Enter edit mode
    } else {
      console.log(`Category with id ${categoryId} not found.`);
    }
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
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                  }}
                >
                  <Spinner color="info">Loading...</Spinner>
                </div>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Feature Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={index}>
                        <td>{category.name}</td>
                        <td>{category.description}</td>
                        <td>
                          {category.status ? (
                            <Badge tag="span" color="success">
                              Active
                            </Badge>
                          ) : (
                            <Badge tag="span" color="danger">
                              Inactive
                            </Badge>
                          )}
                        </td>
                        <td>
                          {category.featureCategory ? (
                            <Badge tag="span" color="success">
                              Yes
                            </Badge>
                          ) : (
                            <Badge tag="span" color="danger">
                              No
                            </Badge>
                          )}
                        </td>
                        <td>
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{ color: "blue", marginRight: "10px" }}
                            onClick={() => handleEdit(category.categoryId)}
                          />{" "}
                          | &nbsp;
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: "red" }}
                            onClick={() => handleDelete(category.categoryId)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
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
                value={selectedCategory ? selectedCategory.name : ''}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Category Description</Label>
              <Input
                id="categoryDescription"
                name="categoryDescription"
                placeholder=""
                type="text"
                value={selectedCategory ? selectedCategory.description : ''}
              />
            </FormGroup>

            <FormGroup>
              <Label for="statusSwitch">Status</Label>
              <CustomInput
                type="switch"
                id="statusSwitch"
                name="statusSwitch"
                label={statusSwitch ? "Active" : "InActive"}
                onChange={() => setStatusSwitch(!statusSwitch)}
                checked={selectedCategory ? selectedCategory.status : false}
                
              />
            </FormGroup>

            <FormGroup>
              <Label for="featureCategorySwitch">Feature Category</Label>
              <CustomInput
                type="switch"
                id="featureCategorySwitch"
                name="featureCategorySwitch"
                label={featureCategorySwitch ? "Yes" : "No"}
                onChange={(e) => setFeatureCategorySwitch(e.target.checked)}
              
                checked={featureCategorySwitch}
              />
              
            </FormGroup>
           <FormGroup>
           {selectedCategory && (
    <input type="hidden" id="categoryId" value={selectedCategory.categoryId} />
  )}
           </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
        {isEditMode ? (
    <Button color="primary" onClick={updateCategory}>
      Update
    </Button>
  ) : (
    <Button color="primary" onClick={createCategory}>
      Add
    </Button>
  )}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Category;
