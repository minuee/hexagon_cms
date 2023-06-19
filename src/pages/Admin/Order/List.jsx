import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { price ,convertUnixToDate , renderPageData} from "common";
import { useQuery } from "hooks";
import dayjs from "dayjs";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable } from "components";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  table_footer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const order_list_columns = [
  { title: "번호", field: "total", width: 80 },
  { title: "구매번호", field: "order_no", width: 240 },
  {
    title: "구매일자",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD"),
    width: 160,
  },
  { title: "회원명", field: "member_name", width: 160 },
  {
    title: "결제방식",
    render: ({ settle_type,settle_type_name }) => settle_type_name,
    width: 120,
  },
  {
    title: "구매액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "슈퍼맨",
    render: ({ is_superman }) => is_superman,
    width: 100,
    cellStyle: { textAlign: "center" },
  },
  {
    title: "주문상태",
    render: ({ order_status,order_status_name,settle_type,is_refund_point }) => (
      <>
        <p>{order_status_name}</p>
        {(settle_type == 'vbank' && order_status == 'CANCEL_A' ) && <span style={{color:'red'}}>{`(환불요청중)`}</span>}
        {(is_refund_point == true && order_status == 'CANCEL_B' ) && <span style={{color:'blue'}}>{`(미출고처리)`}</span>}
      </>
    ),
    width: 150,
    cellStyle: { textAlign: "center" },
  },
  
  /* { title: "주문상태", field: "order_status_name", width: 150 }, */
];
const header_button_list = [
  {
    label: "주문일자순",
    value: "reg_dt",
  },
  {
    label: "이름순",
    value: "uname",
  },
  {
    label: "구매액순",
    value: "order",
  },
  {
    label: "주문상태순",
    value: "ryuin",
  },
];
const order_status_list = [
  {
    label: "주문상태",
    value: "",
  },
  {
    label: "입금대기",
    value: "WAIT",
  },
  {
    label: "입금완료",
    value: "INCOME",
  },
  {
    label: "배송준비중",
    value: "READY",
  },
  {
    label: "출고완료",
    value: "TRANSING",
  },
  {
    label: "배송완료",
    value: "TRANSOK",
  },
  {
    label: "주문취소",
    value: "CANCEL_A",
  },
  {
    label: "주문취소완료",
    value: "CANCEL_B",
  },
  {
    label: "교환요청",
    value: "RETURN",
  },
];
const superman_status_list = [
  {
    label: "슈퍼맨여부",
    value: "",
  },
  {
    label: "사용",
    value: "Y",
  },
  {
    label: "미사용",
    value: "N",
  }
];
export const OrderList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { getDataFunction, Pagination, SearchBox, FilterBox, FilterBox2, TermSearchBox } = useQuery(location);
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const [orderList, setOrderList] = useState();
  const [orderAnalysisList, setOrderAnalysisList] = useState([]);
  const [query2, setQuery] = useState();

  async function getOrderList(query) {
    let resultData = await apiObject.getOrderList({ ...query, is_analysis:true });
    setQuery(query)
    console.log('minuee',query)
    setOrderList(resultData.data);
    setOrderAnalysisList(resultData?.data2);
  }

  useEffect(() => {
    getDataFunction(getOrderList);
  }, []);

  const Heading = [
    ['No.','주문번호', '주문자명', '주문자연락처','주문상태', '결제방법', '주문일자', '최종결제금액', '상품금액', '할인금액', '포인트사용', '쿠폰사용', '배송비', '받는사람', '배송지주소','수신연락처', '배송메모','슈퍼맨배송', '부여리워드', '미출고시', '주문상품수', 
    '상품명(1)','상품개별가격(1)','상품박스가격(1)','상품카톤가격(1)','상품수_박스(1)','상품수_카톤(1)','주문단위(1_1)','주문수량(1_1)','주문가격(1_1)','주문단위(1_2)','주문수량(1_2)','주문가격(1_2)','주문단위(1_3)','주문수량(1_3)','주문가격(1_3)',
    '상품명(2)','상품개별가격(2)','상품박스가격(2)','상품카톤가격(2)','상품수_박스(2)','상품수_카톤(2)','주문단위(2_1)','주문수량(2_1)','주문가격(2_1)','주문단위(2_2)','주문수량(2_2)','주문가격(2_2)','주문단위(2_3)','주문수량(2_3)','주문가격(2_3)',
    '상품명(3)','상품개별가격(3)','상품박스가격(3)','상품카톤가격(3)','상품수_박스(3)','상품수_카톤(3)','주문단위(3_1)','주문수량(3_1)','주문가격(3_1)','주문단위(3_2)','주문수량(3_2)','주문가격(3_2)','주문단위(3_3)','주문수량(3_3)','주문가격(3_3)',
    '상품명(4)','상품개별가격(4)','상품박스가격(4)','상품카톤가격(4)','상품수_박스(4)','상품수_카톤(4)','주문단위(4_1)','주문수량(4_1)','주문가격(4_1)','주문단위(4_2)','주문수량(4_2)','주문가격(4_2)','주문단위(4_3)','주문수량(4_3)','주문가격(4_3)',
    '상품명(5)','상품개별가격(5)','상품박스가격(5)','상품카톤가격(5)','상품수_박스(5)','상품수_카톤(5)','주문단위(5_1)','주문수량(5_1)','주문가격(5_1)','주문단위(5_2)','주문수량(5_2)','주문가격(5_2)','주문단위(5_3)','주문수량(5_3)','주문가격(5_3)',
    '상품명(6)','상품개별가격(6)','상품박스가격(6)','상품카톤가격(6)','상품수_박스(6)','상품수_카톤(6)','주문단위(6_1)','주문수량(6_1)','주문가격(6_1)','주문단위(6_2)','주문수량(6_2)','주문가격(6_2)','주문단위(6_3)','주문수량(6_3)','주문가격(6_3)',
    '상품명(7)','상품개별가격(7)','상품박스가격(7)','상품카톤가격(7)','상품수_박스(7)','상품수_카톤(7)','주문단위(7_1)','주문수량(7_1)','주문가격(7_1)','주문단위(7_2)','주문수량(7_2)','주문가격(7_2)','주문단위(7_3)','주문수량(7_3)','주문가격(7_3)',
    '상품명(8)','상품개별가격(8)','상품박스가격(8)','상품카톤가격(8)','상품수_박스(8)','상품수_카톤(8)','주문단위(8_1)','주문수량(8_1)','주문가격(8_1)','주문단위(8_2)','주문수량(8_2)','주문가격(8_2)','주문단위(8_3)','주문수량(8_3)','주문가격(8_3)',
    '상품명(9)','상품개별가격(9)','상품박스가격(9)','상품카톤가격(9)','상품수_박스(9)','상품수_카톤(9)','주문단위(9_1)','주문수량(9_1)','주문가격(9_1)','주문단위(9_2)','주문수량(9_2)','주문가격(9_2)','주문단위(9_3)','주문수량(9_3)','주문가격(9_3)',
    '상품명(10)','상품개별가격(10)','상품박스가격(10)','상품카톤가격(10)','상품수_박스(10)','상품수_카톤(10)','주문단위(10_1)','주문수량(10_1)','주문가격(10_1)','주문단위(10_2)','주문수량(10_2)','주문가격(10_2)','주문단위(10_3)','주문수량(10_3)','주문가격(10_3)'
  ]];
  const exportExcel = async() => {
    let excelData = await apiObject.getOrderList({ ...query2,is_excel:true });
    if ( excelData != undefined && excelData != null ) {
      let fileName = "전체조회";
      if ( query2?.term_start && query2?.term_end) {
        fileName = convertUnixToDate(query2?.term_start,'YYYYMMDD')+'~'+convertUnixToDate(query2?.term_end,'YYYYMMDD')
      }
      const ws = XLSX.utils.json_to_sheet(excelData,{origin : 'A2',skipHeader:true});
      XLSX.utils.sheet_add_aoa(ws, Heading, {origin : 'A1'})
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
    
      FileSaver.saveAs(data, fileName + fileExtension);
    }else{
      alert('엑셀출력중 오류발생하였습니다.')
      return ;
    }
  }


  const Heading2 = [
    ['No.','주문번호', '주문자명', '주문자연락처','주문상태', '결제방법', '주문일자', '최종결제금액', '상품금액', '할인금액', '포인트사용', '쿠폰사용', '배송비', '받는사람', '배송지주소','수신연락처', '배송메모','슈퍼맨배송', '부여리워드', '미출고시', '주문상품수'
  ]];
  const SubHeading2 = [[
    '주문번호','상품No', '상품명','주문(Each)','주문(Box)','주문(Carton)', '개별단가','박스가격', 'ea/Box','카톤가격', 'ea/Carton'
  ]];
  const exportExcel2 = async() => {
    let excelData = await apiObject.getNewOrderList({ ...query2,is_excel:true });
    console.log("exportExcel2",excelData);
    let newExcelData = [];
    if ( excelData != undefined && excelData != null ) {
      let fileName = "전체조회";
      if ( query2?.term_start && query2?.term_end) {
        fileName = convertUnixToDate(query2?.term_start,'YYYYMMDD')+'~'+convertUnixToDate(query2?.term_end,'YYYYMMDD')
      }
      excelData.forEach((item) => {
        item.details.forEach((item2,index2) => {
          let checkEach = item2.child.findIndex((element) => element.unit_type == 'Each');
          let checkBox = item2.child.findIndex((element) => element.unit_type == 'Box');
          let checkCarton = item2.child.findIndex((element) => element.unit_type == 'Carton')
          if ( index2 == 0 ) {
            newExcelData.push({
              order_no : item.order_no,
              no : index2+1,
              product_name : item2.product_name,
              order_each : checkEach != -1 ? item2.child[checkEach].quantity : '',
              order_box : checkBox != -1 ? item2.child[checkBox].quantity : '',
              order_carton : checkCarton != -1 ? item2.child[checkCarton].quantity : '',
              each_price : item2.each_price,
              box_price : item2.box_price,
              box_unit : item2.box_unit,
              carton_price : item2.carton_price,
              carton_unit : item2.carton_unit,
            })
          }else{ 
            newExcelData.push({
              order_no : '',
              no : index2+1,
              product_name : item2.product_name,
              order_each : checkEach != -1 ? item2.child[checkEach].quantity : '',
              order_box : checkBox != -1 ? item2.child[checkBox].quantity : '',
              order_carton : checkCarton != -1 ? item2.child[checkCarton].quantity : '',
              each_price : item2.each_price,
              box_price : item2.box_price,
              box_unit : item2.box_unit,
              carton_price : item2.carton_price,
              carton_unit : item2.carton_unit,
            })
          }
          
        })
      })
      const ws = XLSX.utils.json_to_sheet(excelData,{origin : 'A2',skipHeader:true});
      const ws2 = XLSX.utils.json_to_sheet(newExcelData,{origin : 'A2',skipHeader:true});
      XLSX.utils.sheet_add_aoa(ws, Heading2, {origin : 'A1'})
      XLSX.utils.sheet_add_aoa(ws2, SubHeading2, {origin : 'A1'})
      let wb = {SheetNames:[], Sheets:{}};
      wb.SheetNames.push("list"); wb.Sheets["list"] = ws;
      wb.SheetNames.push("detaillist"); wb.Sheets["detaillist"] = ws2;
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
    
      FileSaver.saveAs(data, fileName + fileExtension);
    }else{
      alert('엑셀출력중 오류발생하였습니다.')
      return ;
    }
  }
  //불가 '상품옵션',
  const Heading3 = [[
    '주문일자','영업사원코드','주문번호','SubNo','주문상태','주문자명','주문자연락처','받는사람','받는사람연락처','배송지주소','상품명','주문(Each)','주문(Box)','주문(Carton)', '개별단가','박스가격', 'ea/Box','카톤가격', 'ea/Carton','합계금액','상품할인금액', '배송비', '쿠폰사용','포인트사용','최종결제금액','적립예정금액', '배송유형', '결제수단','입금계좌','입금자명','입금기한','결제일','미출고시 조치방법','환불계좌',
  ]];
  const exportExcel3 = async() => {
    let excelData = await apiObject.getNewOrderList({ ...query2,is_excel:true });
    console.log("exportExcel2",excelData);
    let newExcelData = [];
    if ( excelData != undefined && excelData != null ) {
      let fileName = "전체조회";
      if ( query2?.term_start && query2?.term_end) {
        fileName = convertUnixToDate(query2?.term_start,'YYYYMMDD')+'~'+convertUnixToDate(query2?.term_end,'YYYYMMDD')
      }
      excelData.forEach((item) => {
        item.details.forEach((item2,index2) => {
          let checkEach = item2.child.findIndex((element) => element.unit_type == 'Each');
          let checkBox = item2.child.findIndex((element) => element.unit_type == 'Box');
          let checkCarton = item2.child.findIndex((element) => element.unit_type == 'Carton')
          if ( index2 == 0 ) {
            newExcelData.push({
              order_dt : item.excelreg_dt,
              agent_name :  item.agent_name,
              order_no : item.order_no,
              no : index2+1,
              order_status : item.order_status_name,
              member_name :  item.member_name,
              member_phone : item.member_phone,
              delivery_receiver : item.delivery_receiver,
              delivery_phone : item.delivery_phone,
              delivery_address : item.delivery_address,
              product_name : item2.product_name,
              order_each : checkEach != -1 ? item2.child[checkEach].quantity : '',
              order_box : checkBox != -1 ? item2.child[checkBox].quantity : '',
              order_carton : checkCarton != -1 ? item2.child[checkCarton].quantity : '',
              each_price : item2.each_price,
              box_price : item2.box_price,
              box_unit : item2.box_unit,
              carton_price : item2.carton_price,
              carton_unit : item2.carton_unit,
              product_amount : item.product_amount,
              discount_amount : item.discount_amount,
              delivery_amount : item.delivery_amount,
              coupon_amount : item.coupon_amount,
              point_amount : item.point_amount,
              total_amount : item.total_amount,
              reward_point : item.reward_point,
              is_superman : item.is_superman == '안함' ? '일반' : '슈퍼맨배송',
              settle_type : item.settle_type_text,
              income_account : item.vbank_name + " " + item.vbank_num,
              income_name :  item.member_name,
              income_limit : item.income_limit,
              settle_dt : item.income_date,
              refund_type_text : item.refund_type_text,
              refund_accout : item.refund_bankname + " " + item.refund_accountname + " " + item.refund_bankaccount
            })
          }else{ 
            newExcelData.push({
              order_dt : item.excelreg_dt,
              agent_name :  item.agent_name,
              order_no : '',
              no : index2+1,
              order_status : item.order_status_name,
              member_name :  item.member_name,
              member_phone : item.member_phone,
              delivery_receiver : item.delivery_receiver,
              delivery_phone : item.delivery_phone,
              delivery_address : item.delivery_address,
              product_name : item2.product_name,
              order_each : checkEach != -1 ? item2.child[checkEach].quantity : '',
              order_box : checkBox != -1 ? item2.child[checkBox].quantity : '',
              order_carton : checkCarton != -1 ? item2.child[checkCarton].quantity : '',
              each_price : item2.each_price,
              box_price : item2.box_price,
              box_unit : item2.box_unit,
              carton_price : item2.carton_price,
              carton_unit : item2.carton_unit,
              product_amount : item.product_amount,
              discount_amount : item.discount_amount,
              delivery_amount : item.delivery_amount,
              coupon_amount : item.coupon_amount,
              point_amount : item.point_amount,
              total_amount : item.total_amount,
              reward_point : item.reward_point,
              is_superman : item.is_superman == '안함' ? '일반' : '슈퍼맨배송',
              settle_type : item.settle_type_text,
              income_account : item.settle_type_text == "계좌이체" ? item.vbank_name + " " + item.vbank_num : "",
              income_name :  item.member_name,
              income_limit : item.income_limit,
              settle_dt : item.income_date,
              refund_type_text : item.refund_type_text,
              refund_accout : item.refund_bankname + " " + item.refund_accountname + " " + item.refund_bankaccount
            })
          }
        })
      })
      const ws = XLSX.utils.json_to_sheet(newExcelData,{origin : 'A2',skipHeader:true});
      XLSX.utils.sheet_add_aoa(ws, Heading3, {origin : 'A1'})
      const wb = { Sheets: { orders: ws }, SheetNames: ["orders"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
    
      FileSaver.saveAs(data, fileName + fileExtension);
    }else{
      alert('엑셀출력중 오류발생하였습니다.')
      return ;
    }
  }
  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Box>
          <Typography display="inline" variant="h5" fontWeight="500">
            주문내역
          </Typography>

          <FilterBox2 ml={2} item_list={order_status_list} filter_item="order_status" />
          <FilterBox2 ml={2} item_list={superman_status_list} filter_item="is_superman" />
        </Box>

        <Box>
          <FilterBox mr={3} type="sort" button_list={header_button_list} default_item="reg_dt" />

          <TermSearchBox />
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={order_list_columns}
          data={orderList}
          onRowClick={(row) => history.push(`/order/${row.order_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        { orderList?.[0]?.total > 0 &&
          <div>
            {/* <ExcelExportButton path="order" /> */}
            <Button p={1} onClick={exportExcel} mr={1}>엑셀저장</Button>
            <Button p={1} onClick={exportExcel2} ml={1}>엑셀저장2</Button>
            <Button p={1} onClick={exportExcel3} ml={1}>엑셀저장3</Button>
          </div>
        }
        <Pagination total={orderList?.[0]?.total} />

        <SearchBox />
      </Grid>
      <Box mt={4} mb={10} >
        {orderAnalysisList.map((item, index) => (
          <Box display={'flex'} key={index}>
            <Box color="#777" mt={1} >
              {item.title} 
            </Box>
            <Box color="#777" mt={1} ml={1}>
              { item.content && renderPageData(item.content)} 
          </Box>
        </Box>
        ))}
      </Box>

      
    </Box>
  );
};
