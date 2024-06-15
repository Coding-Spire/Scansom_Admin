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
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
// Define the data structure
interface Category {
  name: string;
  description: string;
  categoryId: string;
  status:boolean;
  featureCategory: boolean;

}

const ITEMS_PER_PAGE = 10;

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

   // Add state for pagination
   const [currentPage, setCurrentPage] = useState(0);

   // Calculate the range of items for the current page
   const offset = currentPage * ITEMS_PER_PAGE;
 
   // Slice the products array to get only the items for the current page
   const productsOnPage = categories.slice(offset, offset + ITEMS_PER_PAGE);
 
   // Calculate the total number of pages
   const pageCount = Math.ceil(categories.length / ITEMS_PER_PAGE);
 
   const handlePageClick = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  }


  const [category, setCategory] = useState<Category>({
    categoryId: generateGUID(),
    name: '',
    description: '',
    status: true,
    featureCategory: false,
  });
 
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
 
 

    apiService({
      method: "PUT",
      url: "https://scansommdataservice.azurewebsites.net/api/Category",
      data: category,
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


  function handleCreateNew() {
    setCategory({
      categoryId: generateGUID(),
      name: '',
      description: '',
      status: true,
      featureCategory: false,
    });
    setModal(true); // Open the modal
  }

  // Function to create a category
  function createCategory() {
    

    

    apiService({
      method: "POST",
      url: "https://scansommdataservice.azurewebsites.net/api/Category",
      data: category,
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
      url: "https://scansommdataservice.azurewebsites.net/api/Category",
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
      url: `https://scansommdataservice.azurewebsites.net/api/Category/${categoryId}`,
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
      setCategory(category);
      console.log(category);
      setModal(true); // Open the modal
      setIsEditMode(true); // Enter edit mode
    } else {
      console.log(`Category with id ${categoryId} not found.`);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
    console.log(category);
  };

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
                onClick={handleCreateNew}
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
                <div>
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
                    {productsOnPage.map((category, index) => (
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
                <Pagination>
                <PaginationItem disabled={currentPage <= 0}>
                  <PaginationLink previous onClick={() => handlePageClick(currentPage - 1)} />
                </PaginationItem>
                {Array.from({ length: pageCount }, (_, i) => (
                  <PaginationItem active={i === currentPage} key={i}>
                    <PaginationLink onClick={() => handlePageClick(i)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem disabled={currentPage >= pageCount - 1}>
                  <PaginationLink next onClick={() => handlePageClick(currentPage + 1)} />
                </PaginationItem>
              </Pagination>
              </div>
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
              <Label for="categoryName">Category Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Name"
                type="text"
                value={category.name}
                onChange={handleChange}
                 
              />
            </FormGroup>
            <FormGroup>
              <Label for="categoryDescription">Category Description</Label>
              <Input
                id="description"
                name="description"
                placeholder=""
                type="text"
                value={category.description}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="statusSwitch">Status</Label>
             
              <CustomInput
                type="switch"
                id="statusSwitch"
                name="statusSwitch"
                label={statusSwitch ? "Active" : "InActive"}
                onChange={() => {
                  setStatusSwitch(!statusSwitch);
                  setCategory({ ...category, status: !statusSwitch });
                }}
                checked={statusSwitch}
              />
               
            </FormGroup>

            <FormGroup>
              <Label for="featureCategorySwitch">Feature Category</Label>
              <CustomInput
                type="switch"
                id="featureCategorySwitch"
                name="featureCategorySwitch"
                label={featureCategorySwitch ? "Yes" : "No"}
                onChange={(e) => {
                  setFeatureCategorySwitch(e.target.checked);
                  setCategory({ ...category, featureCategory: !featureCategorySwitch });
                }}
              
                checked={featureCategorySwitch}
              />
              
            </FormGroup>
           <FormGroup>
           {category && (
    <input type="hidden" id="categoryId" value={category.categoryId} />
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
