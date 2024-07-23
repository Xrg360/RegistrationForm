// pages/admin/index.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/context'; // Ensure you have a context provider for authentication
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import app from '@/utils/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import withAuth from '@/utils/withAuth';

const Admin = () => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State for controlling the overlay image
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email === 'rohitbabugeorge@gmail.com') {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setParticipants(data);
        setIsLoading(false);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, db, router]);

  const handleStatusChange = async (id, status) => {
    const userDocRef = doc(db, 'users', id);
    await updateDoc(userDocRef, { status });
    setParticipants((prev) =>
      prev.map((participant) => (participant.id === id ? { ...participant, status } : participant))
    );
  };

  const handleExport = () => {
    const exportData = participants.map(({ id, status, ...fields }) => fields);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    XLSX.writeFile(workbook, 'Participants.xlsx');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleExpand = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeOverlay = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 md:p-6">
      <header className="w-full flex justify-between items-center py-4 bg-white shadow-md px-4 md:px-8">
        <h1 className="text-xl md:text-2xl font-bold text-primary">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">
          Logout
        </button>
      </header>
      <main className="flex-1 w-full max-w-5xl mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Participants List</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg mb-6">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-2 md:px-4">Name</th>
                    <th className="py-2 px-2 md:px-4">Branch</th>
                    <th className="py-2 px-2 md:px-4">Semester</th>
                    <th className="py-2 px-2 md:px-4">College</th>
                    <th className="py-2 px-2 md:px-4">IEEE Member</th>
                    <th className="py-2 px-2 md:px-4">Payment</th>
                    <th className="py-2 px-2 md:px-4">Status</th>
                    <th className="py-2 px-2 md:px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id} className="text-center">
                      <td className="py-2 px-2 md:px-4">{`${participant.fname} ${participant.lname}`}</td>
                      <td className="py-2 px-2 md:px-4">{participant.branch}</td>
                      <td className="py-2 px-2 md:px-4">{participant.sem}</td>
                      <td className="py-2 px-2 md:px-4">{participant.clg}</td>
                      <td className="py-2 px-2 md:px-4">{participant.ieeeMember ? 'Yes' : 'No'}</td>
                      <td className="py-2 px-2 md:px-4" onClick={() => toggleExpand(participant.paymentScreenshot)}>
                        <img
                          src={participant.paymentScreenshot}
                          alt={'payment'}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover cursor-pointer"
                        />
                      </td>
                      <td className="py-2 px-2 md:px-4">{participant.status}</td>
                      <td className="py-2 px-2 md:px-4 flex justify-center">
                        <button
                          className="text-green-500 mx-1 md:mx-2"
                          onClick={() => handleStatusChange(participant.id, 'confirmed')}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className="text-red-500 mx-1 md:mx-2"
                          onClick={() => handleStatusChange(participant.id, 'rejected')}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <button
                          className="text-blue-500 mx-1 md:mx-2"
                          onClick={() => handleStatusChange(participant.id, 'pending')}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleExport}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Export to Excel
            </button>
          </>
        )}
      </main>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeOverlay}
        >
          <img
            src={selectedImage}
            alt="Expanded payment"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

const allowedEmails = ["rohitbabugeorge@gmail.com", "admin1@gmail.com", "admin2@gmail.com"];
export default withAuth(Admin, allowedEmails);
