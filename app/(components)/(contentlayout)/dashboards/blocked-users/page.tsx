"use client";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Row, Pagination } from "react-bootstrap";
import { SquarePlus, Trash2, Pencil } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { deleteIp, getIps } from "@/shared/Api/dashboard";
import Popup from "@/components/Popup";
import { FaTrash } from "react-icons/fa";

function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ipPopup, setIpPopup] = useState(false);
  const [ipVal, setIpVal] = useState("");
  const [checked, setChecked] = useState(false);
  const [ips, setIps] = useState();
  const Ips = useSelector((state: any) => state.dash.ips);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  // const User = useSelector((state: any) => state.dash);
  const dispatch = useDispatch();

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setIpPopup(true);
  };
// console.log('ips in here brother', Ips)
  // console.log(Ips[0].ip)

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const filterIps = (ipToDelete: any) => {
    deleteIp({ id: ipToDelete?._id }, dispatch);
  };

  const handleDeleteSelectedAccounts = async () => {
    await Promise.all(
      selectedAccounts.map((id) => deleteIp({ id }, dispatch))
    );
    setSelectedAccounts([]); // Clear selected accounts
    // fetchAccounts(currentPage); // Refresh after deletion
  };


  
  const toggleSelectAccount = (accountId: string) => {
    setSelectedAccounts((prevSelected) =>
      prevSelected.includes(accountId)
        ? prevSelected.filter((id) => id !== accountId)
        : [...prevSelected, accountId]
    );
  };

  
  const toggleSelectAll = () => {
    if (selectedAccounts.length === Ips.length) {
      setChecked(!checked);
      setSelectedAccounts([]);
    } else {
      setChecked(!checked);
      setSelectedAccounts(Ips.map((account: any) => account._id));
    }
      
  };


  const getAllIps = async () => {
    await getIps(dispatch);
  };

  useEffect(() => {
    if(Ips.length===0 || selectedAccounts.length!==Ips.length){
      setChecked(false)
    }
    if(selectedAccounts.length===Ips.length && selectedAccounts.length>0){
      setChecked(true)
    }
  }, [selectedAccounts,Ips])
  
  

  useEffect(() => {
    getAllIps();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIps = Ips.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <Fragment>
      <Seo title={"blocked-users"} />
      <Row className="mt-2">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>Blocker</Card.Title>
              <div className="d-flex flex-wrap gap-2">
                <div className="flex justify-between gap-2">
                  <button
                    className="title:rounded-md"
                    onClick={handleOpenPopup}
                    title={"Add IP"}
                    >
                    <SquarePlus size={30} className="hover:text-blue-400" />
                  </button>
                  <div
                    title="Delete selected logs"
                    className="hover:text-red-500"
                    >
                    <Button
                      className="btn-md bg-[#546dfe]"
                      onClick={handleDeleteSelectedAccounts}
                      disabled={selectedAccounts.length === 0}
                    >
                      <FaTrash size={14} className="hover:text-red-400" />
                    </Button>
                  </div>
                  <Popup
                    ipPopup={ipPopup}
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    ipVal={ipVal}
                    setIpVal={setIpVal}
                    ips={ips}
                    setIps={setIps}
                    />
                  {/* <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Search Here"
                    aria-label=".form-control-sm example"
                    /> */}
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                      {Ips.length ? (
                <table className="table text-nowrap">
                  <thead>
                    <tr>
                    <th>
                        <input
                          title="select all"
                          className="mt-1"
                          type="checkbox"
                          checked={checked}
                          onChange={toggleSelectAll}
                          />
                      </th>
                      <th>IP Address</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentIps?.length > 0 &&
                      currentIps?.map((item: any) => (
                        <tr key={item?._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedAccounts.includes(item._id)}
                              onChange={() => toggleSelectAccount(item._id)}
                            />
                          </td>
                          {<td>{item?.ip}</td>}
                          <td>
                            <div className="btn-list">
                            {moment(item?.createdAt).format("ddd, MMM DD, YYYY, hh:mm A")}
                            </div>
                          </td>
                          {/* <td> */}
                            {/* Example action buttons */}
                            <td>
                              <button
                                title="Delete IP"
                                className="text-red-500"
                                onClick={() => filterIps(item)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                            {/* <button
                              className="text-blue-500 ml-4"
                              onClick={() => handleUpdate(Ip)}
                              >
                              <Pencil size={14} />
                              </button> */}
                          {/* </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
            ):(
                <div className="text-center h-[500px] flex items-center justify-center self-center">
                  No IPs Found
                </div>)}
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex align-items-center">
                <div>
                  Showing {Ips.length} Entries{" "}
                  <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                </div>
                <div className="ms-auto">
                  <nav
                    aria-label="Page navigation"
                    className="pagination-style-4"
                  >
                    <Pagination className="pagination mb-0">
                      <Pagination.Item
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                      >
                        Prev
                      </Pagination.Item>
                      {Array.from({ length: Math.ceil(Ips.length / itemsPerPage) }).map(
                        (_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={currentPage === index + 1}
                            onClick={() => paginate(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        )
                      )}
                      <Pagination.Item
                        disabled={currentPage === Math.ceil(Ips.length / itemsPerPage)}
                        onClick={() => paginate(currentPage + 1)}
                      >
                        Next
                      </Pagination.Item>
                    </Pagination>
                  </nav>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default Page;

// "use client";
// import Seo from "@/shared/layout-components/seo/seo";
// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Col, Row } from "react-bootstrap";
// import { SquarePlus, Trash2 } from 'lucide-react';
// import { useSelector, useDispatch } from "react-redux";
// import moment from "moment";
// import { deleteIp, getIps } from "@/shared/Api/dashboard";
// import Popup from "@/components/Popup";
// import { FaTrash } from "react-icons/fa";

// // Function to convert an IP address to a number
// function ipToNumber(ip:any) {
//   return ip.split('.').reduce((acc:any, octet:any) => (acc << 8) + parseInt(octet), 0);
// }

// // Function to check if an IP is within a specified range
// function isIpInRange(ip:any, startRange:any, endRange:any) {
//   const ipNum = ipToNumber(ip);
//   return ipNum >= ipToNumber(startRange) && ipNum <= ipToNumber(endRange);
// }

// function Page() {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [ipPopup, setIpPopup] = useState(false);
//   const [ipVal, setIpVal] = useState("");
//   const [checked, setChecked] = useState(false);
//   const [ips, setIps] = useState();
//   const [startRange, setStartRange] = useState(""); // Add start range state
//   const [endRange, setEndRange] = useState(""); // Add end range state
//   const Ips = useSelector((state: any) => state.dash.ips);
//   const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
//   const dispatch = useDispatch();

//   const handleOpenPopup = () => {
//     setIsPopupOpen(true);
//     setIpPopup(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const filterIps = (ipToDelete: any) => {
//     deleteIp({ id: ipToDelete?._id }, dispatch);
//   };

//   const handleDeleteSelectedAccounts = async () => {
//     await Promise.all(
//       selectedAccounts.map((id) => deleteIp({ id }, dispatch))
//     );
//     setSelectedAccounts([]); // Clear selected accounts
//   };

//   const toggleSelectAccount = (accountId: string) => {
//     setSelectedAccounts((prevSelected) =>
//       prevSelected.includes(accountId)
//         ? prevSelected.filter((id) => id !== accountId)
//         : [...prevSelected, accountId]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedAccounts.length === Ips.length) {
//       setChecked(!checked);
//       setSelectedAccounts([]);
//     } else {
//       setChecked(!checked);
//       setSelectedAccounts(Ips.map((account: any) => account._id));
//     }
//   };

//   const getAllIps = async () => {
//     await getIps(dispatch);
//   };

//   useEffect(() => {
//     if(Ips.length===0 || selectedAccounts.length!==Ips.length){
//       setChecked(false)
//     }
//     if(selectedAccounts.length===Ips.length && selectedAccounts.length>0){
//       setChecked(true)
//     }
//   }, [selectedAccounts,Ips])

//   useEffect(() => {
//     getAllIps();
//   }, []);

//   // Function to block IPs within the specified range
//   const blockIpRange = () => {
//     Ips.forEach((ip:any) => {
//       if (isIpInRange(ip.ip, startRange, endRange)) {
//         filterIps(ip);
//       }
//     });
//     handleClosePopup();
//   };

//   return (
//     <Fragment>
//       <Seo title={"blocked-users"} />
//       <Row>
//         <Col xl={12}>
//           <Card className="custom-card">
//             <Card.Header className="justify-content-between">
//               <Card.Title>Blocker</Card.Title>
//               <div className="d-flex flex-wrap gap-2">
//                 <div className="flex justify-between gap-2">
//                   <button
//                     className="title:rounded-md"
//                     onClick={handleOpenPopup}
//                     title={"Add IP"}
//                   >
//                     <SquarePlus size={30} className="hover:text-blue-400" />
//                   </button>
//                   <div
//                     title="Delete selected logs"
//                     className="hover:text-red-500"
//                   >
//                     <Button
//                       className="btn-md bg-[#546dfe]"
//                       onClick={handleDeleteSelectedAccounts}
//                       disabled={selectedAccounts.length === 0}
//                     >
//                       <FaTrash size={14} className="hover:text-red-400" />
//                     </Button>
//                   </div>
//                   <Popup
//                     ipPopup={ipPopup}
//                     isOpen={isPopupOpen}
//                     onClose={handleClosePopup}
//                     ipVal={ipVal}
//                     setIpVal={setIpVal}
//                     ips={ips}
//                     setIps={setIps}
//                     startRange={startRange}
//                     endRange={endRange}
//                     setStartRange={setStartRange}
//                     setEndRange={setEndRange}
//                     blockIpRange={blockIpRange}
//                   />
//                 </div>
                
//               </div>
//             </Card.Header>
//             <Card.Body className="p-0">
//               <div className="table-responsive">
//                 {Ips.length ? (
//                   <table className="table text-nowrap">
//                     <thead>
//                       <tr>
//                         <th>
//                           <input
//                             title="select all"
//                             className="mt-1"
//                             type="checkbox"
//                             checked={checked}
//                             onChange={toggleSelectAll}
//                           />
//                         </th>
//                         <th>IP Address</th>
//                         <th>Date</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {Ips?.map((item: any) => (
//                         <tr key={item?._id}>
//                           <td>
//                             <input
//                               type="checkbox"
//                               checked={selectedAccounts.includes(item._id)}
//                               onChange={() => toggleSelectAccount(item._id)}
//                             />
//                           </td>
//                           <td>{item?.ip}</td>
//                           <td>
//                             <div className="btn-list">
//                               {moment(item?.createdAt).format(
//                                 "ddd, MMM DD, YYYY"
//                               )}
//                             </div>
//                           </td>
//                           <td>
//                             <button
//                               title="Delete IP"
//                               className="text-red-500"
//                               onClick={() => filterIps(item)}
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center h-[500px] flex items-center justify-center self-center">
//                     No IPs Found
//                   </div>
//                 )}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Fragment>
//   );
// }

// export default Page;

