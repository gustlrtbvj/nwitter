import { dbService } from 'fBase';
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query} from 'firebase/firestore';
import React, { useState, useEffect } from "react";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
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
        
    const onSubmit = async (e) => {
        e.preventDefault();
        await addDoc(collection(dbService, "nweets"), {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        });
        setNweet("");
        };
    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNweet(value);
    };



    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="submit" value="Nweet" />
        </form>
        <div>
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