import moment from 'moment';
import React from 'react';
import { defaultCollections } from '../../pages/StatsPage/TopCollectionTable/TopCollectionTable';
import BodyText from '../BodyText/BodyText';
import './ActivityTable.scss';

type TActivity = {
  itemName: string;
  itemImageUrl: string;
  trxType: "Listing" | "Cancel Listing" | "Sale" | "Place Bid";
  trxId: string;
  time: number;
  amount: number;
  mintAddress?: string;
  buyer?: string;
  seller?: string;
}

const ActivityTable = (props: {activities: TActivity[]}) => {
  return(
    <table className="top-collection-table">
      <thead>
        <tr>
          <th><BodyText light>Name</BodyText></th>
          <th><BodyText light>Transaction ID</BodyText></th>
          <th><BodyText light>Transaction Type</BodyText></th>
          <th><BodyText light>Time</BodyText></th>
          <th><BodyText light>Total Amount</BodyText></th>
          {
            props.activities[0].mintAddress &&
            <th><BodyText light>Mint Address</BodyText></th>
          }
          {
            props.activities[0].buyer &&
            <th><BodyText light>Buyer</BodyText></th>
          }
          {
            props.activities[0].seller &&
            <th><BodyText light>Seller</BodyText></th>
          }
         
        </tr>
      </thead>
      <tbody>
        {props.activities.map((activity, i) => 
          <tr key={i}>
            <td>
              <div className="collection-name-and-img-column">
                <img src={activity.itemImageUrl} alt={activity.itemName} />
                <BodyText className="collection-title">{activity.itemName}</BodyText>
              </div>
            </td>
            <td>
              <BodyText className="mobile-title">Transaction ID</BodyText>
              <BodyText light>{
                activity.trxId.slice(0, 4)}...{activity.trxId.slice(
                  activity.trxId.length - 4,
                  activity.trxId.length
                )
              }</BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Transaction Type</BodyText>
              <BodyText light>{activity.trxType}</BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Time</BodyText>
              <BodyText light>{moment(activity.time).fromNow() }</BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Total Amount</BodyText>
              <BodyText light>{activity.amount} Ⓝ</BodyText>
            </td>
            {
              props.activities[0].mintAddress &&
              <td>
                <BodyText className="mobile-title">Mint Address</BodyText>
                <BodyText light>{
                  activity.mintAddress?.slice(0, 4)}...{activity.mintAddress?.slice(
                    activity.mintAddress.length - 4,
                    activity.mintAddress.length
                  )
                }</BodyText>
              </td>
            }
            {
              props.activities[0].buyer &&
              <td>
                <BodyText className="mobile-title">Buyer</BodyText>
                <BodyText light>{
                  activity.buyer?.slice(0, 4)}...{activity.buyer?.slice(
                    activity.buyer.length - 4,
                    activity.buyer.length
                  )
                }</BodyText>
              </td>              
            }
            {
              props.activities[0].seller &&
              <td>
                <BodyText className="mobile-title">Seller</BodyText>
                <BodyText light>{
                  activity.seller?.slice(0, 4)}...{activity.seller?.slice(
                    activity.seller.length - 4,
                    activity.seller.length
                  )
                }</BodyText>
              </td>              
            }
          </tr>
        )}
      </tbody>
    </table>    
  )
}

export default ActivityTable;