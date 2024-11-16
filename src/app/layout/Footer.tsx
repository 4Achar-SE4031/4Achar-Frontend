
import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";
import { BsInstagram } from "react-icons/bs";
import "./Footer.css"

export function FooterComponent() {
    return (
        <Footer container className="footer">
            <div className="w-full text-center">
                <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
                    <FooterBrand
                        href="#"
                        src="https://flowbite.com/docs/images/logo.svg"
                        alt="کنسرتیفای"
                        name="کنسرتیفای"
                        className="text"
                    />
                    <FooterLinkGroup>
                        <FooterLink href="#">درباره</FooterLink>
                        <FooterLink href="#">Privacy Policy</FooterLink>
                        <FooterLink href="#">Licensing</FooterLink>
                        <FooterLink href="#">ارتباط با ما</FooterLink>
                    </FooterLinkGroup>
                </div>
                <FooterDivider />
                <FooterCopyright href="#" by="کنسرتیفای" year={2024} />
                <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                    <Footer.Icon href="#" icon={BsInstagram} />
                </div>
            </div>
        </Footer>
    );
}
