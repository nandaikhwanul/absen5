import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode';

const Dashboard = () => {
    const user = useSelector((state) => state.auth.user);
    const [qrCodeURL, setQrCodeURL] = useState('');

    useEffect(() => {
        console.log('Current user state:', user); // Log user state to inspect the object
        if (user) {
            console.log('NIP:', user.nip); // Log the NIP value
            const data = JSON.stringify({
                nip: user.nip ? String(user.nip) : '', // Ensure NIP is a string
                name: user.name,
                email: user.email
            });

            QRCode.toDataURL(data, { errorCorrectionLevel: 'H' })
                .then(url => {
                    setQrCodeURL(url);
                })
                .catch(err => {
                    console.error('Error generating QR code: ', err);
                });
        }
    }, [user]);

    return (
        <div className="">
            {user ? (
                <div className="mt-6 p-4 ">
                    <h2 className="text-xl font-semibold text-gray-700">User Information</h2>
                    <p className="mt-2 text-gray-600">Name: <span className="font-medium">{user.name}</span></p>
                    <p className="mt-1 text-gray-600">NIP: <span className="font-medium">{user.nip || 'N/A'}</span></p>
                    <p className="mt-1 text-gray-600">Email: <span className="font-medium">{user.email}</span></p>
                    
                    {/* Condition to check if user is not an admin */}
                    {user.role !== 'admin' && (
                        <>
                            <h3 className="mt-4 text-lg font-semibold text-gray-700">Your QR Code</h3>
                            <div className="flex flex-col items-center mt-4">
                                {qrCodeURL ? (
                                    <img src={qrCodeURL} alt="QR Code" className="w-48 h-48 mb-4" />
                                ) : (
                                    <p className="text-gray-500">Generating QR Code...</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p className="mt-4 text-gray-500">No user information available. Please log in.</p>
            )}
        </div>
    );
};

export default Dashboard;
