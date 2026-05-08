import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZbmo8XF7VkpF0b8Lzyt__iKO2Icssm5Q",
  authDomain: "reservi-prelaunch.firebaseapp.com",
  projectId: "reservi-prelaunch",
  storageBucket: "reservi-prelaunch.firebasestorage.app",
  messagingSenderId: "121038881855",
  appId: "1:121038881855:web:383d38a1757cb84b3f248a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const colRef = collection(db, "contact_messages");
    const docRef = await addDoc(colRef, {
      name: "Test",
      email: "test@example.com",
      subject: "Test",
      message: "Test",
      createdAt: serverTimestamp(),
      status: "new"
    });
    console.log("Success contact_messages! docId:", docRef.id);
  } catch (error) {
    console.error("Error contact_messages:", error);
  }

  try {
    const waitlistRef = collection(db, "waitlist_signups");
    const docRef = await addDoc(waitlistRef, {
      email: "test477_new@example.com",
      status: "pending",
      createdAt: serverTimestamp(),
    });
    console.log("Success waitlist_signups! docId:", docRef.id);
  } catch (error) {
    console.error("Error waitlist_signups:", error);
  }
}

test();
