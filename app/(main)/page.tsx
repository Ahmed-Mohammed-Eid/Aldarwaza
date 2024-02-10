import Image from 'next/image'
export default function Home() {

    return (
        <>
            <div className="card" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "580px",
                marginBottom: "0",
            }}>
                <Image
                    src={`/logo-white.svg`}
                    alt="Sakai logo"
                    width={300}
                    height={300}
                />
            </div>
        </>
    );
}