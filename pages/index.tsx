import { Card, Col, Modal, Row, Space } from "antd";
import Meta from "antd/es/card/Meta";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";

interface Movie {
  id: string;
  title: string;
  poster: string;
  director: string;
}

const Index: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [open, setOpen] = useState(false);

  const showModalDelete = () => {
    setOpen(true);
  };

  const hideModalDelete = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/movies");
      const data = await res.json();
      setMovies(data.data);
      console.log(movies);
    };

    fetchData();
  }, []);
  return (
    <>
      <Row gutter={[32, 32]}>
        {movies.map((movie) => (
          <Col span={4}>
            <Card
              key={movie.id}
              cover={
                <img
                  src={movie.poster}
                  style={{ width: "100%", height: 300, objectFit: "cover" }}
                />
              }
              actions={[
                <EditOutlined key="edit" />,
                <DeleteOutlined key="delete" onClick={showModalDelete}/>,
              ]}
            >
              <Meta title={movie.title} description={"This is the description"} />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Etes vous sur de vouloir supprimer ?"
        open={open}
        onOk={hideModalDelete}
        onCancel={hideModalDelete}
        okText="Oui"
        cancelText="Non"
      >
      </Modal>
    </>
  );
};

export default Index;
