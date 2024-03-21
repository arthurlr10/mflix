import React, { useEffect, useState } from "react";
import { Card, Col, Modal, Row } from "antd";
import Meta from "antd/es/card/Meta";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Movie {
  id: string;
  title: string;
  poster: string;
  director: string;
}

const Index: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingMovieId, setDeletingMovieId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/movies");
      const data = await res.json();
      setMovies(data.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <Row gutter={[32, 32]}>
        {movies.map((movie) => (
          <Col span={4} key={movie.id}>
            <Card
              cover={
                <img
                  alt={movie.title}
                  src={movie.poster}
                  style={{ width: "100%", height: 300, objectFit: "cover" }}
                />
              }
              actions={[
                <EditOutlined key="edit" />,
                <DeleteOutlined
                  key="delete"
                />,
              ]}
            >
              <Meta title={movie.title} description={movie.director} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Index;
