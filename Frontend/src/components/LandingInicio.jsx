import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
export function LandingInicio() {
  return (
    <>
      <section className="about">
        <div className="about-container">
          <div className="about-col">
            <h2>Sobre la AEIE</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
              tincidunt dolor at sollicitudin efficitur. Fusce ac metus nunc.
              Vivamus consectetur eu elit id congue. Sed ut lectus vel libero
              consequat vulputate. Proin fermentum elit non lacus placerat
              auctor. Cras volutpat vitae turpis vel placerat. Aliquam erat
              volutpat. Fusce convallis nisl id massa ultricies, non fermentum
              lorem cursus.
            </p>
            <p>
              Phasellus vitae augue ac felis efficitur vulputate id sed felis.
              Integer consequat lacinia nunc, vitae laoreet arcu tincidunt sit
              amet. Donec vitae est sem. Nullam laoreet tempor justo, eget
              sollicitudin lorem interdum ac. Fusce ac libero id augue maximus
              aliquam. Quisque venenatis, eros et euismod cursus, purus mi
              fringilla arcu, at scelerisque odio nulla vel magna.
            </p>
          </div>
          <div className="about-col">
            <h2>Objetivos de la AEIE</h2>
            <ul>
              <li>
                <CheckCircleOutlineIcon sx={{ marginRight: '10px' }} />
                <span>
                  Promover el desarrollo académico y profesional de los
                  estudiantes de Ingeniería Electrónica.
                </span>
              </li>
              <li>
                <CheckCircleOutlineIcon sx={{ marginRight: '10px' }} />
                <span>
                  Organizar eventos y actividades que fomenten el espíritu de
                  colaboración y trabajo en equipo.
                </span>
              </li>
              <li>
                <CheckCircleOutlineIcon sx={{ marginRight: '10px' }} />
                <span>
                  Fomentar la integración de los estudiantes a través de
                  proyectos innovadores.
                </span>
              </li>
              <li>
                <CheckCircleOutlineIcon sx={{ marginRight: '10px' }} />
                <span>
                  Ser un puente entre los estudiantes y la industria
                  tecnológica.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="news">
        <div className="about-container">
          <div className="about-col">
            <h2 className="news-h2">Noticias</h2>
            <p>
              Aqui podras encontrar los ultimos post de nuestra pagina de
              facebook.
            </p>
          </div>
          <div
            className="about-col"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fepn.aeie&tabs=timeline&width=350&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="350"
              height="500"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Facebook Page Embed"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  )
}
