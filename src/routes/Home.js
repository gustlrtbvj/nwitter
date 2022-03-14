import { dbService, storageService } from "fBase";
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL} from "@firebase/storage";
import React, { useState, useEffect, useRef } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";


const Home = ({ userObj }) => {

    const fileInput = useRef();
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        // 실시간으로 데이터를 데이터베이스에서 가져오기
        const q = query(
        collection(getFirestore(), 'nweets'),
        // where('text', '==', 'hehe') // where뿐만아니라 각종 조건 이 영역에 때려부우면 됨
        orderBy('createdAt',"desc")
        );
        const unsubscribe = onSnapshot(q, querySnapshot => {
        const newArray = querySnapshot.docs.map(doc => {
        return {
        id: doc.id,
        ...doc.data(),
        };
        });
        setNweets(newArray);
        console.log('Current tweets in CA: ', newArray);
        });
        return () => {
        unsubscribe();
        };
        }, []);

    return (
      <div className="container">
        <NweetFactory userObj={userObj} />
        <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
          key={nweet.id}
          nweetObj={nweet}
          isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
      </div>
    );
  };
export default Home; 