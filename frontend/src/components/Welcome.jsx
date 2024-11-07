import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode';

const Dashboard = () => {
    const user = useSelector((state) => state.auth.user);
    const [qrCodeURL, setQrCodeURL] = useState('');

    useEffect(() => {
        if (user) {
            const data = JSON.stringify({
                name: user.name,
                nip: user.nip,
                email: user.email,
            });

            QRCode.toDataURL(data, { errorCorrectionLevel: 'H', width: 200 })
                .then(url => {
                    setQrCodeURL(url);
                })
                .catch(err => {
                    console.error('Error generating QR code: ', err);
                });
        }
    }, [user]);

    return (
        <div className="flex p-6 justify-center items-center min-h-screen w-full ">
            {/* Information Section */}
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mr-8 border">
                <h1 className="text-2xl font-semibold mb-6">User Information</h1>
                
                <div className="mb-4">
                    <p className="font-semibold">Name:</p>
                    <p className="text-gray-700">{user?.name || 'N/A'}</p>
                </div>

                <div className="mb-4">
                    <p className="font-semibold">NIP:</p>
                    <p className="text-gray-700">{user?.nip || 'N/A'}</p>
                </div>

                <div className="mb-4">
                    <p className="font-semibold">Email:</p>
                    <p className="text-gray-700">{user?.email || 'N/A'}</p>
                </div>
            </div>

            {/* QR Code Display Section */}
            <div className="mt-8 p-4  rounded-lg shadow-lg w-96 h-82 border">
                {qrCodeURL ? (
                    <img src={qrCodeURL} alt="Generated QR Code" className="w-full h-auto" />
                ) : (
                    <p>No QR Code available</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
