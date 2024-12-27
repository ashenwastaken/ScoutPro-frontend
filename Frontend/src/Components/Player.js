import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerNav from "./PlayerNav";
import PlayerFooter from "./PlayerFooter";
import dummyPlayerImage from "../assets/images/player.png";
import axiosInstance from "../services/axiosInstance";
import Loading from "./Loading";

export default function Player() {
    const { id } = useParams();
    const [player, setPlayer] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlayerProfile = async () => {
            try {
                const { status, data } = await axiosInstance.get(`/player/${id}`);
                if (status === 200) {
                    setPlayer(data);
                }
            } catch (error) {
                if (error.response?.data?.error) {
                    alert(error.response.data.error);
                } else if (error.request) {
                    alert("Network error: Please check your internet connection.");
                } else {
                    alert("An error occurred while fetching the player profile.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayerProfile();
    }, [id]);

    const requestPdf = async (id) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/generate-pdf/${id}`, {
                responseType: "blob",
            });

            if (response.status === 200) {
                const pdfBlob = new Blob([response.data], { type: "application/pdf" });
                const downloadUrl = URL.createObjectURL(pdfBlob);

                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = `ScoutPro-${player.playerName || "Player"}.pdf`;
                document.body.appendChild(link);
                link.click();

                URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(link);
            }
        } catch (error) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else if (error.request) {
                alert("Network error: Please check your internet connection.");
            } else {
                alert("An error occurred while generating the PDF.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const playerImages = player.images || [];
    const playerVideos = player.videos || [];
    const playerDescription = player.description || "No description available.";
    const validPlayerVideos = playerVideos.filter((url) => url);

    if (!player.images || !player.playerName)
        return <Loading isLoading={isLoading} />;

    return (
<>
            <PlayerNav player={player} requestPdf={requestPdf} />
            <section className="heroSection">
                <div className="heroBackground">
                    <div className="container">
                        <div className="row align-items-center justify-content-center mb-5 customHeroTextandImage">
                            <div className="col-12 col-lg-6 d-flex flex-direction-column justify-content-left">
                                <div>
                                    <h1 className="heroPlayerName" data-text={player.playerName}>
                                        {player.playerName || "Player Name"}
                                    </h1>
                                    <div className="heroPlayerWrapper">
                                        <h5 className="infoHeading">Team</h5>
                                        <p className="infoText">Los Angeles Leopards</p>
                                    </div>
                                    <div className="heroPlayerWrapper">
                                        <h5 className="infoHeading">Position</h5>
                                        <p className="infoText">{player.position || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 width-auto">
                                <div className="heroImageWrapper">
                                    <img
                                        alt="Player main display"
                                        src={
                                            playerImages.length > 0 && playerImages[0].path
                                                ? playerImages[0].path
                                                : dummyPlayerImage
                                        }
                                        className="heroPlayerImage"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="allStatsWrapper">
                            <div className="combined-stats remaining-stats"> {/* Combined stats now use remaining-stats class */}
                            <div className="statsWrapper"> {/* Use statsWrapper for consistent styling */}
                                <p className="playerStatsHeading">Lane Agility</p>
                                <p className="playerStats">{player.laneAgility || "N/A"}</p>
                            </div>
                            <div className="statsWrapper"> {/* Use statsWrapper for consistent styling */}
                                <p className="playerStatsHeading">Reactive Shuttle</p>
                                <p className="playerStats">{player.shuttle || "N/A"}</p>
                            </div>
                        </div>


        <div className="remaining-stats">
          {[
            { label: "Weight", value: player.weight },
            { label: "Height", value: player.heightWithShoes },
            { label: "BF", value: player.bodyFat },
            { label: "Wingspan", value: player.wingSpan },
            { label: "Standing Reach", value: player.standingReach },
            { label: "Hand Width", value: player.handWidth },
            { label: "Hand Length", value: player.handLength },
            { label: "Standing Vert", value: player.standingVert },
            { label: "Max Vert", value: player.maxVert },
          ].map((stat, index) => (
            <div key={index} className="statsWrapper">
              <p className="playerStatsHeading">{stat.label}</p>
              <p className="playerStats">{stat.value || "N/A"}</p>
            </div>
          ))}
        </div>
      </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row align-items-center my-5">
                    <div className="col-12 col-lg-6 mt-0 imgWithSvg">
                        <svg
                            width="361"
                            height="503"
                            viewBox="0 0 361 503"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M129.477 159.886H194.984L65.5064 503H0L129.477 159.886Z"
                                fill="#A40F37"
                                fillOpacity="0.2"
                            />
                            <path
                                d="M290.476 0H360.797L221.804 368.205H151.483L290.476 0Z"
                                fill="#A40F37"
                                fillOpacity="0.2"
                            />
                            <path
                                d="M135.666 419.848H209.569L178.095 503H104.448L135.666 419.848Z"
                                fill="#A40F37"
                                fillOpacity="0.2"
                            />
                        </svg>
                        <div className="d-flex justify-content-center">
                            <div className="heroImageWrapper">
                                <img
                                    alt="Player mugshot"
                                    src={
                                        playerImages.length > 1 && playerImages[1].path
                                            ? playerImages[1].path
                                            : dummyPlayerImage
                                    }
                                    className="heroPlayerImage"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 mt-5 mt-lg-0">
                        <h2 className="playerProfileText">Player Profile</h2>
                        <p className="playerProfileSubHeading">
                            {playerDescription
                                .split("\n")
                                .filter((sentence) => sentence.trim() !== "")
                                .map((sentence, index, array) => (
                                    <React.Fragment key={index}>
                                        {sentence.trim()}
                                        {index < array.length - 1 && (
                                            <>
                                                <br />
                                                <br />
                                            </>
                                        )}
                                    </React.Fragment>
                                ))}
                        </p>
                    </div>
                </div>
            </section>

            <section className="footageContainer">
                <div className="container text-center">
                    <h2 className="footageHeading">Game Footage and Highlights</h2>
                    <div className="row justify-content-left">
                        {validPlayerVideos.length > 0 ? (
                            validPlayerVideos.map((url, index) => (
                                <div key={index} className="col-12 col-lg">
                                    <iframe
                                        title={`Frame ${index + 1}`}
                                        width="100%"
                                        height="550"
                                        src={url}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ))
                        ) : (
                            <p className="noVideoText">No video added</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row align-items-center my-5">
                    <div className="col-12 col-lg-6 mt-0">
                        <h2 className="playerProfileText">Downloadable PDF</h2>
                        <p className="playerProfileSubHeading">
                            For a comprehensive review, coaches and scouts can download the
                            athlete's detailed profile in PDF format. This downloadable player
                            card includes basic information, key statistics, and any embedded
                            commentary or notes, serving as a valuable resource for evaluations.
                            <br />
                            <br />
                            The PDF offers a quick yet thorough snapshot of the athlete’s strengths and achievements, curated for effective evaluation. Note that the content is non-editable once downloaded, ensuring a consistent, professional document for internal or scouting purposes.
                        </p>
                        <button
                            onClick={() => requestPdf(player._id)}
                            className="downloadPdfBtnRed"
                            type="button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Generating PDF..." : "Download PDF"}
                        </button>
                    </div>
                    <div className="col-12 col-lg-6 mt-5 mt-lg-0 imgWithSvgReverse">
                        <svg
                            width="369"
                            viewBox="0 0 369 514"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M132.622 163.383H199.561L67.2524 514H0.313477L132.622 163.383Z"
                                fill="#A40F37"
                                fillOpacity="0.2"
                            />
                            <path
                                d="M297.142 0H369L226.968 376.258H155.109L297.142 0Z"
                                fill="#A40F37"
                                fillOpacity="0.2"
                            />
                            <path
                                d="M139.005 428.689H214.938L182.384 514H106.451L139.005 428.689Z"
                                fill="#A40F37"
                                fillOpacity="0.2"
                            />
                        </svg>
                        <div className="d-flex justify-content-center">
                            <div className="heroImageWrapper">
                                <img
                                    alt="Player action"
                                    src={
                                        playerImages.length > 2 && playerImages[2].path
                                            ? playerImages[2].path
                                            : dummyPlayerImage
                                    }
                                    className="heroPlayerImage"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PlayerFooter />
        </>
    );
}
