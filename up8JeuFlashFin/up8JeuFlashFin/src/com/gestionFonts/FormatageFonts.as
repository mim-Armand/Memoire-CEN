package com.gestionFonts 
{
	import flash.text.Font;
	import flash.text.TextFormat;
	
	
	/**
	 * ...
	 * @author Sam
	 */
	public class FormatageFonts 
	{
		
		public var policeArial:Font = new Arial();
		public var formatageNbVies:TextFormat = new TextFormat();
		
		
		
		public function FormatageFonts() 
		{
			formatageNbVies.font = policeArial.fontName;
			formatageNbVies.bold = true;
			formatageNbVies.size = 24;
			
		}
		
	}

}